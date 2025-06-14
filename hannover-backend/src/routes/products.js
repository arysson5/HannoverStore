import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productsController.js';
import { authenticateToken } from '../middleware/auth.js';

export default async function productsRoutes(fastify) {
  // Buscar todos os produtos (público)
  fastify.get('/', {
    schema: {
      description: 'Listar produtos com filtros e paginação',
      tags: ['Products'],
      querystring: {
        type: 'object',
        properties: {
          category: { 
            type: 'string',
            description: 'Filtrar por categoria',
            example: 'smartphones'
          },
          featured: { 
            type: 'string',
            description: 'Filtrar produtos em destaque (true/false)',
            example: 'true'
          },
          search: { 
            type: 'string',
            description: 'Buscar por texto no título ou descrição',
            example: 'Samsung'
          },
          page: { 
            type: 'integer', 
            minimum: 1, 
            default: 1,
            description: 'Número da página',
            example: 1
          },
          limit: { 
            type: 'integer', 
            minimum: 1, 
            maximum: 50, 
            default: 10,
            description: 'Itens por página (máximo 50)',
            example: 10
          },
          sortBy: { 
            type: 'string', 
            default: 'createdAt',
            description: 'Campo para ordenação',
            example: 'price'
          },
          sortOrder: { 
            type: 'string', 
            enum: ['asc', 'desc'], 
            default: 'desc',
            description: 'Ordem da classificação',
            example: 'asc'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            products: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: '1' },
                  title: { type: 'string', example: 'Smartphone Samsung Galaxy A54' },
                  description: { type: 'string', example: 'Smartphone Samsung Galaxy A54 5G 128GB...' },
                  price: { type: 'string', example: 'R$ 1.299,99' },
                  image: { type: 'string', example: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
                  category: { type: 'string', example: 'smartphones' },
                  stock: { type: 'integer', example: 15 },
                  featured: { type: 'boolean', example: true },
                  createdAt: { type: 'string', example: '2024-01-15T10:00:00Z' },
                  updatedAt: { type: 'string', example: '2024-01-15T10:00:00Z' }
                }
              }
            },
            pagination: {
              type: 'object',
              properties: {
                currentPage: { type: 'integer', example: 1 },
                totalPages: { type: 'integer', example: 5 },
                totalItems: { type: 'integer', example: 50 },
                itemsPerPage: { type: 'integer', example: 10 }
              }
            }
          }
        }
      }
    }
  }, getProducts);

  // Buscar produto por ID (público)
  fastify.get('/:id', {
    schema: {
      description: 'Buscar produto específico por ID',
      tags: ['Products'],
      params: {
        type: 'object',
        properties: {
          id: { 
            type: 'string',
            description: 'ID do produto',
            example: '1'
          }
        },
        required: ['id']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            product: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '1' },
                title: { type: 'string', example: 'Smartphone Samsung Galaxy A54' },
                description: { type: 'string', example: 'Smartphone Samsung Galaxy A54 5G 128GB...' },
                price: { type: 'string', example: 'R$ 1.299,99' },
                image: { type: 'string', example: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
                category: { type: 'string', example: 'smartphones' },
                stock: { type: 'integer', example: 15 },
                featured: { type: 'boolean', example: true },
                createdAt: { type: 'string', example: '2024-01-15T10:00:00Z' },
                updatedAt: { type: 'string', example: '2024-01-15T10:00:00Z' }
              }
            }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Produto não encontrado' },
            code: { type: 'string', example: 'PRODUCT_NOT_FOUND' }
          }
        }
      }
    }
  }, getProductById);

  // Criar produto (requer autenticação - admin)
  fastify.post('/', {
    preHandler: authenticateToken,
    schema: {
      description: 'Criar um novo produto (requer autenticação)',
      tags: ['Products'],
      security: [{ Bearer: [] }],
      body: {
        type: 'object',
        required: ['title', 'description', 'price', 'category'],
        properties: {
          title: { 
            type: 'string', 
            minLength: 1,
            description: 'Título do produto',
            example: 'iPhone 15 Pro'
          },
          description: { 
            type: 'string', 
            minLength: 1,
            description: 'Descrição detalhada do produto',
            example: 'iPhone 15 Pro 256GB Titânio Natural'
          },
          price: { 
            type: 'string',
            description: 'Preço do produto no formato brasileiro',
            example: 'R$ 8.999,99'
          },
          image: { 
            type: 'string',
            description: 'URL da imagem do produto',
            example: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
          },
          category: { 
            type: 'string',
            description: 'Categoria do produto',
            example: 'smartphones'
          },
          stock: { 
            type: 'integer', 
            minimum: 0,
            description: 'Quantidade em estoque',
            example: 10
          },
          featured: { 
            type: 'boolean',
            description: 'Se o produto é destaque',
            example: true
          }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Produto criado com sucesso' },
            product: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '1234567890' },
                title: { type: 'string', example: 'iPhone 15 Pro' },
                description: { type: 'string', example: 'iPhone 15 Pro 256GB Titânio Natural' },
                price: { type: 'string', example: 'R$ 8.999,99' },
                image: { type: 'string', example: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
                category: { type: 'string', example: 'smartphones' },
                stock: { type: 'integer', example: 10 },
                featured: { type: 'boolean', example: true },
                createdAt: { type: 'string', example: '2024-01-15T10:00:00Z' },
                updatedAt: { type: 'string', example: '2024-01-15T10:00:00Z' }
              }
            }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Título, descrição, preço e categoria são obrigatórios' },
            code: { type: 'string', example: 'MISSING_FIELDS' }
          }
        }
      }
    }
  }, createProduct);

  // Atualizar produto (requer autenticação - admin)
  fastify.put('/:id', {
    preHandler: authenticateToken,
    schema: {
      description: 'Atualizar produto existente (requer autenticação)',
      tags: ['Products'],
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          id: { 
            type: 'string',
            description: 'ID do produto',
            example: '1'
          }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          title: { 
            type: 'string', 
            minLength: 1,
            description: 'Novo título do produto',
            example: 'iPhone 15 Pro Max'
          },
          description: { 
            type: 'string', 
            minLength: 1,
            description: 'Nova descrição do produto',
            example: 'iPhone 15 Pro Max 512GB Titânio Natural'
          },
          price: { 
            type: 'string',
            description: 'Novo preço do produto',
            example: 'R$ 10.999,99'
          },
          image: { 
            type: 'string',
            description: 'Nova URL da imagem',
            example: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
          },
          category: { 
            type: 'string',
            description: 'Nova categoria',
            example: 'smartphones'
          },
          stock: { 
            type: 'integer', 
            minimum: 0,
            description: 'Nova quantidade em estoque',
            example: 5
          },
          featured: { 
            type: 'boolean',
            description: 'Se o produto é destaque',
            example: true
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Produto atualizado com sucesso' },
            product: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '1' },
                title: { type: 'string', example: 'iPhone 15 Pro Max' },
                description: { type: 'string', example: 'iPhone 15 Pro Max 512GB Titânio Natural' },
                price: { type: 'string', example: 'R$ 10.999,99' },
                updatedAt: { type: 'string', example: '2024-01-15T11:00:00Z' }
              }
            }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Produto não encontrado' },
            code: { type: 'string', example: 'PRODUCT_NOT_FOUND' }
          }
        }
      }
    }
  }, updateProduct);

  // Deletar produto (requer autenticação - admin)
  fastify.delete('/:id', {
    preHandler: authenticateToken,
    schema: {
      description: 'Deletar produto (requer autenticação)',
      tags: ['Products'],
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          id: { 
            type: 'string',
            description: 'ID do produto a ser deletado',
            example: '1'
          }
        },
        required: ['id']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Produto removido com sucesso' }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Produto não encontrado' },
            code: { type: 'string', example: 'PRODUCT_NOT_FOUND' }
          }
        }
      }
    }
  }, deleteProduct);
} 