import dotenv from 'dotenv';
import process from 'process';

// Carregar variáveis de ambiente
dotenv.config({ path: './config.env' });

const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET;

// Validação de variáveis críticas em produção
if (NODE_ENV === 'production' && !JWT_SECRET) {
  console.error('❌ ERRO: JWT_SECRET não definido! Configure a variável de ambiente JWT_SECRET.');
  process.exit(1);
}

export const config = {
  port: process.env.PORT || 3002,
  host: process.env.HOST || '0.0.0.0',
  jwt: {
    secret: JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
  },
  bcrypt: {
    saltRounds: 10
  },
  database: {
    type: 'json',
    paths: {
      products: './data/products.json',
      users: './data/users.json',
      orders: './data/orders.json',
      categories: './data/categories.json'
    }
  }
}; 