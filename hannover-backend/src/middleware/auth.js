import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import database from '../utils/database.js';

export const authenticateToken = async (request, reply) => {
  try {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return reply.status(401).send({
        error: 'Token de acesso requerido',
        code: 'MISSING_TOKEN'
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await database.getUserById(decoded.userId);

    if (!user) {
      return reply.status(401).send({
        error: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    // Remove senha do objeto do usuário
    const { password, ...userWithoutPassword } = user;
    request.user = userWithoutPassword;
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return reply.status(401).send({
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return reply.status(401).send({
        error: 'Token expirado',
        code: 'EXPIRED_TOKEN'
      });
    }

    return reply.status(500).send({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const optionalAuth = async (request, reply) => {
  try {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await database.getUserById(decoded.userId);
      
      if (user) {
        const { password, ...userWithoutPassword } = user;
        request.user = userWithoutPassword;
      }
    }
  } catch (error) {
    // Em caso de erro, apenas continue sem autenticação
    request.user = null;
  }
}; 