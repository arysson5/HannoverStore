import Fastify from 'fastify';
import { readFileSync, writeFileSync, readFile, writeFile } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração com variáveis de ambiente para Render
const JWT_SECRET = process.env.JWT_SECRET || 'hannover-store-secret-key-2024';
const PORT = process.env.PORT || 3002;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Função para ler arquivos JSON
async function readJsonFile(filename) {
  try {
    const data = await readFile(join(__dirname, '../data', filename), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erro ao ler ${filename}:`, error);
    return [];
  }
}

// Função para escrever arquivos JSON
async function writeJsonFile(filename, data) {
  try {
    await writeFile(join(__dirname, '../data', filename), JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Erro ao escrever ${filename}:`, error);
    throw error;
  }
}

// Inicializar Fastify
console.log('🚀 Iniciando servidor com src/server-simple.js');
const fastify = Fastify({
  logger: NODE_ENV === 'development' ? {
    transport: {
      target: 'pino-pretty'
    }
  } : true
});

// CORS manual
fastify.addHook('preHandler', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (request.method === 'OPTIONS') {
    reply.code(200).send();
    return;
  }
});

// Utilitários para banco JSON
const readJSONFile = (filename) => {
  try {
    const filePath = join(__dirname, '..', 'data', filename);
    const data = readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erro ao ler ${filename}:`, error);
    return [];
  }
};

const writeJSONFile = (filename, data) => {
  try {
    const filePath = join(__dirname, '..', 'data', filename);
    writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Erro ao escrever ${filename}:`, error);
    return false;
  }
};

// Middleware de autenticação
const authenticate = async (request, reply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      reply.code(401).send({ error: 'Token não fornecido' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    request.user = decoded;
  } catch (error) {
    reply.code(401).send({ error: 'Token inválido' });
  }
};

// Rotas de Autenticação
fastify.post('/api/auth/register', async (request, reply) => {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return reply.code(400).send({ error: 'Todos os campos são obrigatórios' });
    }

    const users = readJSONFile('users.json');
    
    if (users.find(user => user.email === email)) {
      return reply.code(400).send({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeJSONFile('users.json', users);

    const { password: _, ...userWithoutPassword } = newUser;
    reply.code(201).send({ 
      message: 'Usuário criado com sucesso',
      user: userWithoutPassword 
    });
  } catch (error) {
    reply.code(500).send({ error: 'Erro interno do servidor' });
  }
});

fastify.post('/api/auth/login', async (request, reply) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return reply.code(400).send({ error: 'Email e senha são obrigatórios' });
    }

    const users = readJSONFile('users.json');
    const user = users.find(u => u.email === email);

    if (!user || !await bcrypt.compare(password, user.password)) {
      return reply.code(401).send({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    reply.send({ 
      message: 'Login realizado com sucesso',
      token,
      user: userWithoutPassword 
    });
  } catch (error) {
    reply.code(500).send({ error: 'Erro interno do servidor' });
  }
});

// Rotas de Produtos
fastify.get('/api/products', async (request, reply) => {
  try {
    const products = readJSONFile('products.json');
    const { 
      category, 
      brand, 
      search, 
      minPrice, 
      maxPrice, 
      page = 1, 
      limit = 12 
    } = request.query;

    let filteredProducts = [...products];

    // Filtros
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (brand) {
      filteredProducts = filteredProducts.filter(p => 
        p.brand?.toLowerCase().includes(brand.toLowerCase())
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.brand?.toLowerCase().includes(searchLower)
      );
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    reply.send({
      products: paginatedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredProducts.length,
        pages: Math.ceil(filteredProducts.length / limit)
      }
    });
  } catch (error) {
    reply.code(500).send({ error: 'Erro ao buscar produtos' });
  }
});

fastify.get('/api/products/:id', async (request, reply) => {
  try {
    const products = readJSONFile('products.json');
    const product = products.find(p => p.id === request.params.id);

    if (!product) {
      return reply.code(404).send({ error: 'Produto não encontrado' });
    }

    reply.send(product);
  } catch (error) {
    reply.code(500).send({ error: 'Erro ao buscar produto' });
  }
});

// Rotas de Categorias
fastify.get('/api/categories', async (request, reply) => {
  try {
    const categories = readJSONFile('categories.json');
    reply.send(categories);
  } catch (error) {
    reply.code(500).send({ error: 'Erro ao buscar categorias' });
  }
});

fastify.get('/api/categories/search', async (request, reply) => {
  try {
    const { q } = request.query;
    const categories = readJSONFile('categories.json');
    
    if (!q) {
      return reply.send(categories);
    }

    const filteredCategories = categories.filter(cat =>
      cat.name.toLowerCase().includes(q.toLowerCase()) ||
      cat.description.toLowerCase().includes(q.toLowerCase())
    );

    reply.send(filteredCategories);
  } catch (error) {
    reply.code(500).send({ error: 'Erro ao buscar categorias' });
  }
});

// Rotas de Pedidos (protegidas)
fastify.post('/api/orders', { preHandler: authenticate }, async (request, reply) => {
  try {
    const { items, shipping, total } = request.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return reply.code(400).send({ error: 'Itens do pedido são obrigatórios' });
    }

    const orders = readJSONFile('orders.json');
    const products = readJSONFile('products.json');

    // Verificar estoque e calcular total
    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        return reply.code(400).send({ error: `Produto ${item.productId} não encontrado` });
      }

      if (product.stock < item.quantity) {
        return reply.code(400).send({ 
          error: `Estoque insuficiente para ${product.name}` 
        });
      }

      calculatedTotal += product.price * item.quantity;
      orderItems.push({
        ...item,
        name: product.name,
        price: product.price
      });

      // Atualizar estoque
      product.stock -= item.quantity;
    }

    const newOrder = {
      id: Date.now().toString(),
      userId: request.user.id,
      items: orderItems,
      shipping: shipping || {},
      total: calculatedTotal,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    writeJSONFile('orders.json', orders);
    writeJSONFile('products.json', products);

    reply.code(201).send({
      message: 'Pedido criado com sucesso',
      order: newOrder
    });
  } catch (error) {
    reply.code(500).send({ error: 'Erro ao criar pedido' });
  }
});

fastify.get('/api/orders', { preHandler: authenticate }, async (request, reply) => {
  try {
    const orders = readJSONFile('orders.json');
    const userOrders = orders.filter(order => order.userId === request.user.id);
    reply.send(userOrders);
  } catch (error) {
    reply.code(500).send({ error: 'Erro ao buscar pedidos' });
  }
});

// Middleware para verificar admin
const verifyAdmin = async (request, reply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      reply.code(401).send({ error: 'Token não fornecido' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const users = JSON.parse(await fs.readFile(path.join(__dirname, '../data/users.json'), 'utf8'));
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user || user.role !== 'admin') {
      reply.code(403).send({ error: 'Acesso negado. Apenas administradores.' });
      return;
    }

    request.user = user;
  } catch (error) {
    reply.code(401).send({ error: 'Token inválido' });
  }
};

// Rotas Admin
fastify.get('/api/admin/stats', { preHandler: verifyAdmin }, async () => {
  const [products, users, categories] = await Promise.all([
    readJsonFile('products.json'),
    readJsonFile('users.json'),
    readJsonFile('categories.json')
  ]);
  
  return {
    totalProducts: products.length,
    totalUsers: users.length,
    totalCategories: categories.length,
    totalOrders: 0
  };
});

fastify.get('/api/admin/users', { preHandler: verifyAdmin }, async () => {
  const users = await readJsonFile('users.json');
  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    password: user.password // Para visualização admin
  }));
});

fastify.delete('/api/admin/users/:id', { preHandler: verifyAdmin }, async (request, reply) => {
  const users = await readJsonFile('users.json');
  const userIndex = users.findIndex(u => u.id === request.params.id);
  
  if (userIndex === -1) {
    reply.code(404).send({ error: 'Usuário não encontrado' });
    return;
  }
  
  // Não permitir deletar o próprio usuário admin
  if (users[userIndex].id === request.user.id) {
    reply.code(400).send({ error: 'Não é possível deletar seu próprio usuário' });
    return;
  }
  
  users.splice(userIndex, 1);
  await writeJsonFile('users.json', users);
  
  return { message: 'Usuário deletado com sucesso' };
});

fastify.post('/api/admin/products', { preHandler: verifyAdmin }, async (request) => {
  const products = await readJsonFile('products.json');
  const newProduct = {
    id: uuidv4(),
    ...request.body,
    createdAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  await writeJsonFile('products.json', products);
  
  return newProduct;
});

fastify.put('/api/admin/products/:id', { preHandler: verifyAdmin }, async (request, reply) => {
  console.log('PUT /api/admin/products/:id - ID:', request.params.id);
  console.log('Body:', request.body);
  console.log('User:', request.user);
  
  const products = await readJsonFile('products.json');
  const productIndex = products.findIndex(p => p.id === request.params.id);
  
  console.log('Produto encontrado no índice:', productIndex);
  
  if (productIndex === -1) {
    console.log('Produto não encontrado com ID:', request.params.id);
    reply.code(404).send({ error: 'Produto não encontrado' });
    return;
  }
  
  // Atualizar produto mantendo id e createdAt
  products[productIndex] = {
    ...products[productIndex],
    ...request.body,
    id: request.params.id,
    updatedAt: new Date().toISOString()
  };
  
  await writeJsonFile('products.json', products);
  
  console.log('Produto atualizado com sucesso');
  return products[productIndex];
});

fastify.delete('/api/admin/products/:id', { preHandler: verifyAdmin }, async (request, reply) => {
  const products = await readJsonFile('products.json');
  const productIndex = products.findIndex(p => p.id === request.params.id);
  
  if (productIndex === -1) {
    reply.code(404).send({ error: 'Produto não encontrado' });
    return;
  }
  
  products.splice(productIndex, 1);
  await writeJsonFile('products.json', products);
  
  return { message: 'Produto deletado com sucesso' };
});

// Rota de health check
fastify.get('/api/health', async (request, reply) => {
  reply.send({ status: 'OK', timestamp: new Date().toISOString() });
});

// Iniciar servidor
const start = async () => {
  try {
    // Render requer host 0.0.0.0 e porta dinâmica
    await fastify.listen({ 
      port: PORT, 
      host: '0.0.0.0' 
    });
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📚 Health check: /api/health`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 