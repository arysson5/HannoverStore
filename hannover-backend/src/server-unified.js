import Fastify from 'fastify';
import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import process from 'process';

// Carregar variáveis de ambiente
dotenv.config({ path: './config.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração com variáveis de ambiente para Render
const JWT_SECRET = process.env.JWT_SECRET || 'hannover-store-secret-key-2024';
const PORT = process.env.PORT || 3002;
const NODE_ENV = process.env.NODE_ENV || 'development';
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY || 'AIzaSyDummyKeyForDevelopment123456789';

// Função para ler arquivos JSON
async function readJsonFile(filename) {
  try {
    const data = await readFile(join(__dirname, '../data', filename), { encoding: 'utf8' });
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
console.log('🚀 Iniciando servidor unificado Hannover Store');
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
  reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (request.method === 'OPTIONS') {
    reply.code(200).send();
  }
});

// Middleware para verificar autenticação
const authenticateToken = async (request, reply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      reply.code(401).send({ error: 'Token não fornecido' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const users = await readJsonFile('users.json');
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) {
      reply.code(401).send({ error: 'Usuário não encontrado' });
      return;
    }
    
    request.user = user;
  } catch {
    reply.code(401).send({ error: 'Token inválido' });
  }
};

// Middleware para verificar admin
const verifyAdmin = async (request, reply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      reply.code(401).send({ error: 'Token não fornecido' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const users = await readJsonFile('users.json');
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user || user.role !== 'admin') {
      reply.code(403).send({ error: 'Acesso negado. Apenas administradores.' });
      return;
    }
    
    request.user = user;
  } catch {
    reply.code(401).send({ error: 'Token inválido' });
  }
};

// ==================== ROTAS PÚBLICAS ====================

// Health check
fastify.get('/api/health', async () => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

// Obter chave API do Google AI (pública para o chatbot)
fastify.get('/api/google-ai-key', async (request, reply) => {
  try {
    return { apiKey: GOOGLE_AI_API_KEY };
  } catch (error) {
    console.error('Erro ao buscar chave API:', error);
    reply.code(500).send({ error: 'Erro interno do servidor' });
  }
});

// ==================== ROTAS DE AUTENTICAÇÃO ====================

// Registrar usuário
fastify.post('/api/auth/register', async (request, reply) => {
  try {
    const { name, email, password } = request.body;
    
    if (!name || !email || !password) {
      return reply.code(400).send({ error: 'Todos os campos são obrigatórios' });
    }
    
    const users = await readJsonFile('users.json');
    
    // Verificar se email já existe
    if (users.find(u => u.email === email)) {
      return reply.code(400).send({ error: 'Email já cadastrado' });
    }
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Criar usuário
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await writeJsonFile('users.json', users);
    
    // Gerar token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
    
    return {
      message: 'Usuário criado com sucesso',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    };
  } catch (error) {
    console.error('Erro no registro:', error);
    reply.code(500).send({ error: 'Erro interno do servidor' });
  }
});

// Login
fastify.post('/api/auth/login', async (request, reply) => {
  try {
    const { email, password } = request.body;
    
    if (!email || !password) {
      return reply.code(400).send({ error: 'Email e senha são obrigatórios' });
    }
    
    const users = await readJsonFile('users.json');
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return reply.code(401).send({ error: 'Credenciais inválidas' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return reply.code(401).send({ error: 'Credenciais inválidas' });
    }
    
    // Gerar token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    return {
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Erro no login:', error);
    reply.code(500).send({ error: 'Erro interno do servidor' });
  }
});

// Obter perfil do usuário
fastify.get('/api/auth/profile', { preHandler: authenticateToken }, async (request) => {
  return {
    id: request.user.id,
    name: request.user.name,
    email: request.user.email,
    role: request.user.role,
    createdAt: request.user.createdAt
  };
});

// Listar todos os usuários (admin)
fastify.get('/api/auth/users', { preHandler: verifyAdmin }, async () => {
  const users = await readJsonFile('users.json');
  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  }));
});

// ==================== ROTAS DE PRODUTOS ====================

// Listar produtos
fastify.get('/api/products', async (request) => {
  const products = await readJsonFile('products.json');
  const { page = 1, limit = 12, category, search, brand } = request.query;
  
  let filteredProducts = [...products];
  
  // Filtros
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  if (brand) {
    filteredProducts = filteredProducts.filter(p => p.brand === brand);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Paginação
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  return {
    products: paginatedProducts,
    total: filteredProducts.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(filteredProducts.length / limit)
  };
});

// Obter produto por ID
fastify.get('/api/products/:id', async (request, reply) => {
  const products = await readJsonFile('products.json');
  const product = products.find(p => p.id === request.params.id);
  
  if (!product) {
    return reply.code(404).send({ error: 'Produto não encontrado' });
  }
  
  return product;
});

// ==================== ROTAS DE CATEGORIAS ====================

// Listar categorias
fastify.get('/api/categories', async () => {
  return await readJsonFile('categories.json');
});

// Obter categoria por ID
fastify.get('/api/categories/:id', async (request, reply) => {
  const categories = await readJsonFile('categories.json');
  const category = categories.find(c => c.id === request.params.id);
  
  if (!category) {
    return reply.code(404).send({ error: 'Categoria não encontrada' });
  }
  
  return category;
});

// ==================== ROTAS DE PEDIDOS ====================

// Criar pedido
fastify.post('/api/orders', { preHandler: authenticateToken }, async (request, reply) => {
  try {
    const orders = await readJsonFile('orders.json');
    const newOrder = {
      id: uuidv4(),
      userId: request.user.id,
      ...request.body,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    await writeJsonFile('orders.json', orders);
    
    return newOrder;
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return reply.code(500).send({ error: 'Erro interno do servidor' });
  }
});

// Listar pedidos do usuário
fastify.get('/api/orders', { preHandler: authenticateToken }, async (request) => {
  const orders = await readJsonFile('orders.json');
  return orders.filter(order => order.userId === request.user.id);
});

// Obter pedido por ID
fastify.get('/api/orders/:id', { preHandler: authenticateToken }, async (request, reply) => {
  const orders = await readJsonFile('orders.json');
  const order = orders.find(o => o.id === request.params.id && o.userId === request.user.id);
  
  if (!order) {
    return reply.code(404).send({ error: 'Pedido não encontrado' });
  }
  
  return order;
});

// ==================== ROTAS ADMIN ====================

// Dashboard admin
fastify.get('/api/admin/stats', { preHandler: verifyAdmin }, async () => {
  const [products, users, categories, orders] = await Promise.all([
    readJsonFile('products.json'),
    readJsonFile('users.json'),
    readJsonFile('categories.json'),
    readJsonFile('orders.json')
  ]);
  
  return {
    totalProducts: products.length,
    totalUsers: users.length,
    totalCategories: categories.length,
    totalOrders: orders.length
  };
});

// Gerenciar usuários (admin)
fastify.get('/api/admin/users', { preHandler: verifyAdmin }, async () => {
  const users = await readJsonFile('users.json');
  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  }));
});

fastify.delete('/api/admin/users/:id', { preHandler: verifyAdmin }, async (request, reply) => {
  const users = await readJsonFile('users.json');
  const userIndex = users.findIndex(u => u.id === request.params.id);
  
  if (userIndex === -1) {
    return reply.code(404).send({ error: 'Usuário não encontrado' });
  }
  
  // Não permitir deletar o próprio usuário admin
  if (users[userIndex].id === request.user.id) {
    return reply.code(400).send({ error: 'Não é possível deletar seu próprio usuário' });
  }
  
  users.splice(userIndex, 1);
  await writeJsonFile('users.json', users);
  
  return { message: 'Usuário deletado com sucesso' };
});

// Gerenciar produtos (admin)
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
  const products = await readJsonFile('products.json');
  const productIndex = products.findIndex(p => p.id === request.params.id);
  
  if (productIndex === -1) {
    return reply.code(404).send({ error: 'Produto não encontrado' });
  }
  
  products[productIndex] = {
    ...products[productIndex],
    ...request.body,
    updatedAt: new Date().toISOString()
  };
  
  await writeJsonFile('products.json', products);
  
  return products[productIndex];
});

fastify.delete('/api/admin/products/:id', { preHandler: verifyAdmin }, async (request, reply) => {
  const products = await readJsonFile('products.json');
  const productIndex = products.findIndex(p => p.id === request.params.id);
  
  if (productIndex === -1) {
    return reply.code(404).send({ error: 'Produto não encontrado' });
  }
  
  products.splice(productIndex, 1);
  await writeJsonFile('products.json', products);
  
  return { message: 'Produto deletado com sucesso' };
});

// Status da chave API (admin) - agora é fixa via variável de ambiente
fastify.get('/api/admin/google-ai-key', { preHandler: verifyAdmin }, async (request, reply) => {
  try {
    return {
      hasApiKey: !!GOOGLE_AI_API_KEY,
      apiKey: GOOGLE_AI_API_KEY ? `${GOOGLE_AI_API_KEY.substring(0, 8)}...${GOOGLE_AI_API_KEY.substring(GOOGLE_AI_API_KEY.length - 4)}` : null,
      message: 'Chave API configurada via variável de ambiente GOOGLE_AI_API_KEY'
    };
  } catch (error) {
    console.error('Erro ao buscar status da chave API:', error);
    reply.code(500).send({ error: 'Erro interno do servidor' });
  }
});

// ==================== INICIALIZAÇÃO DO SERVIDOR ====================

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 Servidor Hannover Store rodando na porta ${PORT}`);
    console.log(`📊 Ambiente: ${NODE_ENV}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
