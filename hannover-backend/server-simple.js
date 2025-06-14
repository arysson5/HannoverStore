import fastify from 'fastify';
import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify({ 
  logger: true,
  bodyLimit: 1048576, // 1MB
  ignoreTrailingSlash: true
});

// Registrar suporte para JSON
app.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
  try {
    const json = JSON.parse(body);
    done(null, json);
  } catch (err) {
    err.statusCode = 400;
    done(err, undefined);
  }
});

const JWT_SECRET = 'hannover-store-secret-key-2024';

// CORS manual
app.addHook('onRequest', async (request, reply) => {
  console.log(`\n📡 === NOVA REQUISIÇÃO ===`);
  console.log(`📡 Método: ${request.method}`);
  console.log(`📡 URL: ${request.url}`);
  console.log(`📡 Origin: ${request.headers.origin || 'N/A'}`);
  console.log(`📡 Content-Type: ${request.headers['content-type'] || 'N/A'}`);
  console.log(`📡 User-Agent: ${request.headers['user-agent'] || 'N/A'}`);
  console.log(`📡 Referer: ${request.headers.referer || 'N/A'}`);
  console.log(`📡 Headers completos:`, JSON.stringify(request.headers, null, 2));
  
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  reply.header('Access-Control-Max-Age', '86400');
  
  if (request.method === 'OPTIONS') {
    console.log('✅ Respondendo OPTIONS request');
    reply.code(200).send();
    return;
  }
  console.log(`📡 === FIM REQUISIÇÃO ===\n`);
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
    const users = JSON.parse(await fs.readFile(path.join(__dirname, 'data/users.json'), 'utf8'));
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user || user.role !== 'admin') {
      reply.code(403).send({ error: 'Acesso negado. Apenas administradores.' });
      return;
    }

    request.user = user;
  } catch (error) {
    console.error('Erro na verificação de admin:', error);
    reply.code(401).send({ error: 'Token inválido' });
  }
};

// Função para ler arquivos JSON
async function readJsonFile(filename) {
  try {
    const data = await fs.readFile(path.join(__dirname, 'data', filename), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erro ao ler ${filename}:`, error);
    return [];
  }
}

// Função para escrever arquivos JSON
async function writeJsonFile(filename, data) {
  try {
    await fs.writeFile(
      path.join(__dirname, 'data', filename),
      JSON.stringify(data, null, 2),
      'utf8'
    );
  } catch (error) {
    console.error(`Erro ao escrever ${filename}:`, error);
    throw error;
  }
}

// Health check
app.get('/api/health', async () => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

// Produtos
app.get('/api/products', async (request) => {
  const products = await readJsonFile('products.json');
  const { category, brand, search, minPrice, maxPrice, page = 1, limit = 12 } = request.query;
  
  let filteredProducts = products;
  
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  if (brand) {
    filteredProducts = filteredProducts.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }
  
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm)
    );
  }
  
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
  }
  
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  return {
    products: paginatedProducts,
    total: filteredProducts.length,
    page: parseInt(page),
    totalPages: Math.ceil(filteredProducts.length / limit)
  };
});

app.get('/api/products/:id', async (request, reply) => {
  const products = await readJsonFile('products.json');
  const product = products.find(p => p.id === request.params.id);
  
  if (!product) {
    reply.code(404).send({ error: 'Produto não encontrado' });
    return;
  }
  
  return product;
});

// Categorias
app.get('/api/categories', async () => {
  const categories = await readJsonFile('categories.json');
  return categories;
});

app.get('/api/categories/search', async (request) => {
  const categories = await readJsonFile('categories.json');
  const { q } = request.query;
  
  if (!q) {
    return categories;
  }
  
  const searchTerm = q.toLowerCase();
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm) ||
    cat.description.toLowerCase().includes(searchTerm)
  );
  
  return filteredCategories;
});

// Autenticação
app.post('/api/auth/register', async (request, reply) => {
  console.log('📝 Tentativa de registro - Body completo:', request.body);
  console.log('📝 Headers:', request.headers);
  
  const { name, email, password } = request.body || {};
  
  if (!name || !email || !password) {
    console.log('❌ Dados incompletos para registro - name:', name, 'email:', email, 'password:', password ? '[PRESENTE]' : '[AUSENTE]');
    reply.code(400).send({ error: 'Nome, email e senha são obrigatórios' });
    return;
  }
  
  try {
    const users = await readJsonFile('users.json');
    
    if (users.find(u => u.email === email)) {
      console.log('❌ Email já cadastrado:', email);
      reply.code(400).send({ error: 'Email já cadastrado' });
      return;
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role: email === 'admin@hannover.com' ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await writeJsonFile('users.json', users);
    
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
    
    console.log('✅ Usuário registrado com sucesso:', email);
    
    return {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    };
  } catch (error) {
    console.error('❌ Erro no registro:', error);
    reply.code(500).send({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/auth/login', async (request, reply) => {
  console.log('🔐 Tentativa de login - Body completo:', request.body);
  console.log('🔐 Headers:', request.headers);
  
  const { email, password } = request.body || {};
  
  if (!email || !password) {
    console.log('❌ Dados incompletos para login - email:', email, 'password:', password ? '[PRESENTE]' : '[AUSENTE]');
    reply.code(400).send({ error: 'Email e senha são obrigatórios' });
    return;
  }
  
  try {
    const users = await readJsonFile('users.json');
    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.log('❌ Usuário não encontrado:', email);
      reply.code(401).send({ error: 'Credenciais inválidas' });
      return;
    }
    
    console.log('🔍 Verificando senha para usuário:', email);
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('🔍 Senha válida:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('❌ Senha inválida para:', email);
      reply.code(401).send({ error: 'Credenciais inválidas' });
      return;
    }
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    console.log('✅ Login realizado com sucesso:', email);
    
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    console.error('❌ Erro no login:', error);
    reply.code(500).send({ error: 'Erro interno do servidor' });
  }
});

// Rotas Admin
app.get('/api/admin/stats', { preHandler: verifyAdmin }, async () => {
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

app.get('/api/admin/users', { preHandler: verifyAdmin }, async () => {
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

app.delete('/api/admin/users/:id', { preHandler: verifyAdmin }, async (request, reply) => {
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

app.post('/api/admin/products', { preHandler: verifyAdmin }, async (request) => {
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

app.put('/api/admin/products/:id', { preHandler: verifyAdmin }, async (request, reply) => {
  const products = await readJsonFile('products.json');
  const productIndex = products.findIndex(p => p.id === request.params.id);
  
  if (productIndex === -1) {
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
  
  return products[productIndex];
});

app.delete('/api/admin/products/:id', { preHandler: verifyAdmin }, async (request, reply) => {
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

app.post('/api/admin/categories', { preHandler: verifyAdmin }, async (request) => {
  const categories = await readJsonFile('categories.json');
  const newCategory = {
    id: uuidv4(),
    ...request.body,
    createdAt: new Date().toISOString()
  };
  
  categories.push(newCategory);
  await writeJsonFile('categories.json', categories);
  
  return newCategory;
});

app.put('/api/admin/categories/:id', { preHandler: verifyAdmin }, async (request, reply) => {
  const categories = await readJsonFile('categories.json');
  const categoryIndex = categories.findIndex(c => c.id === request.params.id);
  
  if (categoryIndex === -1) {
    reply.code(404).send({ error: 'Categoria não encontrada' });
    return;
  }
  
  // Atualizar categoria mantendo id e createdAt
  categories[categoryIndex] = {
    ...categories[categoryIndex],
    ...request.body,
    id: request.params.id,
    updatedAt: new Date().toISOString()
  };
  
  await writeJsonFile('categories.json', categories);
  
  return categories[categoryIndex];
});

app.delete('/api/admin/categories/:id', { preHandler: verifyAdmin }, async (request, reply) => {
  const categories = await readJsonFile('categories.json');
  const categoryIndex = categories.findIndex(c => c.id === request.params.id);
  
  if (categoryIndex === -1) {
    reply.code(404).send({ error: 'Categoria não encontrada' });
    return;
  }
  
  categories.splice(categoryIndex, 1);
  await writeJsonFile('categories.json', categories);
  
  return { message: 'Categoria deletada com sucesso' };
});

// Handler para rotas não encontradas
app.setNotFoundHandler(async (request, reply) => {
  console.log(`❌ Rota não encontrada: ${request.method} ${request.url}`);
  console.log(`❌ Headers:`, request.headers);
  
  if (request.url.includes('/api/auth/')) {
    reply.code(405).send({
      error: 'Método não permitido',
      message: `Rota ${request.method}:${request.url} não encontrada. Verifique se está usando o método HTTP correto.`,
      availableRoutes: [
        'POST /api/auth/login',
        'POST /api/auth/register'
      ]
    });
  } else {
    reply.code(404).send({
      error: 'Não encontrado',
      message: `Rota ${request.method}:${request.url} não encontrada`,
      statusCode: 404
    });
  }
});

// Inicializar servidor
const start = async () => {
  try {
    await app.listen({ port: 3002, host: '0.0.0.0' });
    console.log('🚀 Servidor rodando na porta 3002');
    console.log('📊 Admin padrão: admin@hannover.com / admin123');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start(); 