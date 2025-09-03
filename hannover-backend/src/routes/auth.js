import { register, login, getProfile, updateProfile, getAllUsers } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

export default async function authRoutes(fastify) {
  // Registro de usuário
  fastify.post('/register', {
    schema: {
      description: 'Registrar um novo usuário',
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { 
            type: 'string', 
            minLength: 2,
            description: 'Nome completo do usuário',
            example: 'João Silva'
          },
          email: { 
            type: 'string', 
            format: 'email',
            description: 'Email do usuário',
            example: 'joao@email.com'
          },
          password: { 
            type: 'string', 
            minLength: 6,
            description: 'Senha do usuário (mínimo 6 caracteres)',
            example: '123456'
          }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Usuário criado com sucesso' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '1234567890' },
                name: { type: 'string', example: 'João Silva' },
                email: { type: 'string', example: 'joao@email.com' },
                role: { type: 'string', example: 'customer' },
                createdAt: { type: 'string', example: '2024-01-15T10:00:00Z' }
              }
            },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Nome, email e senha são obrigatórios' },
            code: { type: 'string', example: 'MISSING_FIELDS' }
          }
        },
        409: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Email já cadastrado' },
            code: { type: 'string', example: 'EMAIL_EXISTS' }
          }
        }
      }
    }
  }, register);

  // Login de usuário
  fastify.post('/login', {
    schema: {
      description: 'Fazer login na aplicação',
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { 
            type: 'string', 
            format: 'email',
            description: 'Email do usuário',
            example: 'joao@email.com'
          },
          password: { 
            type: 'string', 
            minLength: 1,
            description: 'Senha do usuário',
            example: '123456'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login realizado com sucesso' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '1234567890' },
                name: { type: 'string', example: 'João Silva' },
                email: { type: 'string', example: 'joao@email.com' },
                role: { type: 'string', example: 'customer' }
              }
            },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
          }
        },
        401: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Credenciais inválidas' },
            code: { type: 'string', example: 'INVALID_CREDENTIALS' }
          }
        }
      }
    }
  }, login);

  // Buscar perfil do usuário (requer autenticação)
  fastify.get('/profile', {
    preHandler: authenticateToken,
    schema: {
      description: 'Buscar perfil do usuário autenticado',
      tags: ['Auth'],
      security: [{ Bearer: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '1234567890' },
                name: { type: 'string', example: 'João Silva' },
                email: { type: 'string', example: 'joao@email.com' },
                role: { type: 'string', example: 'customer' },
                createdAt: { type: 'string', example: '2024-01-15T10:00:00Z' },
                updatedAt: { type: 'string', example: '2024-01-15T10:00:00Z' }
              }
            }
          }
        },
        401: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Token de acesso requerido' },
            code: { type: 'string', example: 'MISSING_TOKEN' }
          }
        }
      }
    }
  }, getProfile);

  // Atualizar perfil do usuário (requer autenticação)
  fastify.put('/profile', {
    preHandler: authenticateToken,
    schema: {
      description: 'Atualizar perfil do usuário autenticado',
      tags: ['Auth'],
      security: [{ Bearer: [] }],
      body: {
        type: 'object',
        properties: {
          name: { 
            type: 'string', 
            minLength: 2,
            description: 'Novo nome do usuário',
            example: 'João Santos Silva'
          },
          email: { 
            type: 'string', 
            format: 'email',
            description: 'Novo email do usuário',
            example: 'joao.santos@email.com'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Perfil atualizado com sucesso' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '1234567890' },
                name: { type: 'string', example: 'João Santos Silva' },
                email: { type: 'string', example: 'joao.santos@email.com' },
                role: { type: 'string', example: 'customer' },
                updatedAt: { type: 'string', example: '2024-01-15T11:00:00Z' }
              }
            }
          }
        },
        409: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Email já cadastrado' },
            code: { type: 'string', example: 'EMAIL_EXISTS' }
          }
        }
      }
    }
  }, updateProfile);

  // Buscar todos os usuários (requer autenticação de admin)
  fastify.get('/users', {
    preHandler: authenticateToken,
    schema: {
      description: 'Buscar todos os usuários (apenas para administradores)',
      tags: ['Auth'],
      security: [{ Bearer: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: '1234567890' },
                  name: { type: 'string', example: 'João Silva' },
                  email: { type: 'string', example: 'joao@email.com' },
                  role: { type: 'string', example: 'customer' },
                  createdAt: { type: 'string', example: '2024-01-15T10:00:00Z' }
                }
              }
            }
          }
        },
        401: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Token de acesso requerido' },
            code: { type: 'string', example: 'MISSING_TOKEN' }
          }
        },
        403: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Acesso negado. Apenas administradores' },
            code: { type: 'string', example: 'ACCESS_DENIED' }
          }
        }
      }
    }
  }, getAllUsers);
} 