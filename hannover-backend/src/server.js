import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { config } from './config.js';

// Importar rotas
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import ordersRoutes from './routes/orders.js';
import categoriesRoutes from './routes/categories.js';

const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  }
});

// Registrar Swagger
await fastify.register(swagger, {
  swagger: {
    info: {
      title: 'Hannover Store API',
      description: 'API REST para a loja virtual Hannover Store',
      version: '1.0.0',
      contact: {
        name: 'Hannover Store',
        email: 'contato@hannoverstore.com'
      }
    },
    host: `localhost:${config.port}`,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'Auth', description: 'Endpoints de autenticação' },
      { name: 'Products', description: 'Endpoints de produtos' },
      { name: 'Orders', description: 'Endpoints de pedidos' },
      { name: 'Categories', description: 'Endpoints de categorias' }
    ],
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Token JWT no formato: Bearer <token>'
      }
    }
  }
});

await fastify.register(swaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
  transformSpecificationClone: true
});

// Registrar plugins
await fastify.register(cors, config.cors);
await fastify.register(multipart);

// Middleware global para logs
fastify.addHook('onRequest', async (request) => {
  request.log.info(`${request.method} ${request.url}`);
});

// Middleware global para tratamento de erros
fastify.setErrorHandler(async (error, request, reply) => {
  request.log.error(error);
  
  // Erro de validação do schema
  if (error.validation) {
    return reply.status(400).send({
      error: 'Dados inválidos',
      code: 'VALIDATION_ERROR',
      details: error.validation
    });
  }

  // Erro genérico
  return reply.status(500).send({
    error: 'Erro interno do servidor',
    code: 'INTERNAL_ERROR'
  });
});

// Rota de health check
fastify.get('/', {
  schema: {
    description: 'Informações básicas da API',
    tags: ['Health'],
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          version: { type: 'string' },
          status: { type: 'string' },
          timestamp: { type: 'string' }
        }
      }
    }
  }
}, async () => {
  return {
    message: 'Hannover Store API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
  };
});

fastify.get('/health', {
  schema: {
    description: 'Status de saúde da API',
    tags: ['Health'],
    response: {
      200: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          timestamp: { type: 'string' },
          uptime: { type: 'number' }
        }
      }
    }
  }
}, async () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
});

// Registrar rotas da API
await fastify.register(authRoutes, { prefix: '/api/auth' });
await fastify.register(productsRoutes, { prefix: '/api/products' });
await fastify.register(ordersRoutes, { prefix: '/api/orders' });
await fastify.register(categoriesRoutes, { prefix: '/api/categories' });

// Iniciar servidor
const start = async () => {
  try {
    await fastify.listen({ 
      port: config.port, 
      host: config.host 
    });
    
    console.log(`🚀 Servidor rodando em http://${config.host}:${config.port}`);
    console.log(`📚 Documentação da API disponível em http://${config.host}:${config.port}/documentation`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 