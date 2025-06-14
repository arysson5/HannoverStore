import database from '../utils/database.js';

export const getProducts = async (request, reply) => {
  try {
    const { 
      category, 
      featured, 
      search, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = request.query;

    let products = await database.getProducts();

    // Filtrar por categoria
    if (category) {
      products = products.filter(product => product.category === category);
    }

    // Filtrar por produtos em destaque
    if (featured !== undefined) {
      const isFeatured = featured === 'true';
      products = products.filter(product => product.featured === isFeatured);
    }

    // Buscar por texto
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(product => 
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Ordenação
    products.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Tratamento especial para preços
      if (sortBy === 'price') {
        aValue = parseFloat(a.price.replace('R$ ', '').replace(',', '.'));
        bValue = parseFloat(b.price.replace('R$ ', '').replace(',', '.'));
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = products.slice(startIndex, endIndex);

    return reply.send({
      products: paginatedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(products.length / limit),
        totalItems: products.length,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const getProductById = async (request, reply) => {
  try {
    const { id } = request.params;
    const product = await database.getProductById(id);

    if (!product) {
      return reply.status(404).send({
        error: 'Produto não encontrado',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    return reply.send({ product });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const createProduct = async (request, reply) => {
  try {
    const { title, description, price, image, category, stock, featured } = request.body;

    // Validação básica
    if (!title || !description || !price || !category) {
      return reply.status(400).send({
        error: 'Título, descrição, preço e categoria são obrigatórios',
        code: 'MISSING_FIELDS'
      });
    }

    const newProduct = await database.createProduct({
      title,
      description,
      price,
      image: image || 'https://via.placeholder.com/400x400?text=Produto',
      category,
      stock: stock || 0,
      featured: featured || false
    });

    return reply.status(201).send({
      message: 'Produto criado com sucesso',
      product: newProduct
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const updateProduct = async (request, reply) => {
  try {
    const { id } = request.params;
    const updates = request.body;

    const updatedProduct = await database.updateProduct(id, updates);

    if (!updatedProduct) {
      return reply.status(404).send({
        error: 'Produto não encontrado',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    return reply.send({
      message: 'Produto atualizado com sucesso',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const deleteProduct = async (request, reply) => {
  try {
    const { id } = request.params;
    const deleted = await database.deleteProduct(id);

    if (!deleted) {
      return reply.status(404).send({
        error: 'Produto não encontrado',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    return reply.send({
      message: 'Produto removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
}; 