import database from '../utils/database.js';

export const getCategories = async (request, reply) => {
  try {
    const categories = await database.getCategories();
    return reply.send({ categories });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const getCategoryById = async (request, reply) => {
  try {
    const { id } = request.params;
    const category = await database.getCategoryById(id);

    if (!category) {
      return reply.status(404).send({
        error: 'Categoria não encontrada',
        code: 'CATEGORY_NOT_FOUND'
      });
    }

    return reply.send({ category });
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
}; 