import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import database from '../utils/database.js';

export const register = async (request, reply) => {
  try {
    const { name, email, password } = request.body;

    // Validação básica
    if (!name || !email || !password) {
      return reply.status(400).send({
        error: 'Nome, email e senha são obrigatórios',
        code: 'MISSING_FIELDS'
      });
    }

    // Verificar se o email já existe
    const existingUser = await database.getUserByEmail(email);
    if (existingUser) {
      return reply.status(409).send({
        error: 'Email já cadastrado',
        code: 'EMAIL_EXISTS'
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

    // Criar usuário
    const newUser = await database.createUser({
      name,
      email,
      password: hashedPassword,
      role: 'customer'
    });

    // Gerar token JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Remover senha da resposta
    const { password: _, ...userResponse } = newUser;

    return reply.status(201).send({
      message: 'Usuário criado com sucesso',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const login = async (request, reply) => {
  try {
    const { email, password } = request.body;

    // Validação básica
    if (!email || !password) {
      return reply.status(400).send({
        error: 'Email e senha são obrigatórios',
        code: 'MISSING_FIELDS'
      });
    }

    // Buscar usuário
    const user = await database.getUserByEmail(email);
    if (!user) {
      return reply.status(401).send({
        error: 'Credenciais inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return reply.status(401).send({
        error: 'Credenciais inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Remover senha da resposta
    const { password: _, ...userResponse } = user;

    return reply.send({
      message: 'Login realizado com sucesso',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const getProfile = async (request, reply) => {
  try {
    return reply.send({
      user: request.user
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const updateProfile = async (request, reply) => {
  try {
    const { name, email } = request.body;
    const userId = request.user.id;

    // Verificar se o novo email já existe (se foi alterado)
    if (email && email !== request.user.email) {
      const existingUser = await database.getUserByEmail(email);
      if (existingUser) {
        return reply.status(409).send({
          error: 'Email já cadastrado',
          code: 'EMAIL_EXISTS'
        });
      }
    }

    // Atualizar usuário
    const updatedUser = await database.updateUser(userId, {
      name: name || request.user.name,
      email: email || request.user.email
    });

    if (!updatedUser) {
      return reply.status(404).send({
        error: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    // Remover senha da resposta
    const { password: _, ...userResponse } = updatedUser;

    return reply.send({
      message: 'Perfil atualizado com sucesso',
      user: userResponse
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const getAllUsers = async (request, reply) => {
  try {
    // Verificar se o usuário é admin
    if (request.user.role !== 'admin') {
      return reply.status(403).send({
        error: 'Acesso negado. Apenas administradores podem visualizar todos os usuários',
        code: 'ACCESS_DENIED'
      });
    }

    // Buscar todos os usuários
    const users = await database.getAllUsers();
    
    // Remover senhas dos usuários
    const usersWithoutPasswords = users.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return reply.send({ users: usersWithoutPasswords });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
}; 