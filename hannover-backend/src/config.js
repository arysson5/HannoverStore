export const config = {
  port: process.env.PORT || 3002,
  host: process.env.HOST || '0.0.0.0',
  jwt: {
    secret: process.env.JWT_SECRET || 'hannover-store-secret-key-2024',
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