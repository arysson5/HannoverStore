import { getCategories, getCategoryById } from '../controllers/categoriesController.js';

export default async function categoriesRoutes(fastify) {
  // Buscar todas as categorias (público)
  fastify.get('/', getCategories);

  // Buscar categoria por ID (público)
  fastify.get('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, getCategoryById);
} 