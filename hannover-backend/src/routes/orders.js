import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus 
} from '../controllers/ordersController.js';
import { authenticateToken } from '../middleware/auth.js';

export default async function ordersRoutes(fastify) {
  // Criar pedido (requer autenticação)
  fastify.post('/', {
    preHandler: authenticateToken,
    schema: {
      body: {
        type: 'object',
        required: ['items', 'shippingAddress'],
        properties: {
          items: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['productId', 'quantity'],
              properties: {
                productId: { type: 'string' },
                quantity: { type: 'integer', minimum: 1 }
              }
            }
          },
          shippingAddress: {
            type: 'object',
            required: ['street', 'city', 'state', 'zipCode'],
            properties: {
              street: { type: 'string', minLength: 1 },
              number: { type: 'string' },
              complement: { type: 'string' },
              neighborhood: { type: 'string' },
              city: { type: 'string', minLength: 1 },
              state: { type: 'string', minLength: 2, maxLength: 2 },
              zipCode: { type: 'string', minLength: 8, maxLength: 9 }
            }
          },
          paymentMethod: { type: 'string' }
        }
      }
    }
  }, createOrder);

  // Buscar pedidos do usuário (requer autenticação)
  fastify.get('/', {
    preHandler: authenticateToken
  }, getOrders);

  // Buscar pedido por ID (requer autenticação)
  fastify.get('/:id', {
    preHandler: authenticateToken,
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, getOrderById);

  // Atualizar status do pedido (requer autenticação)
  fastify.patch('/:id/status', {
    preHandler: authenticateToken,
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { 
            type: 'string', 
            enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] 
          }
        }
      }
    }
  }, updateOrderStatus);
} 