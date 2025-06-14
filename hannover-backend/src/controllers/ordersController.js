import database from '../utils/database.js';

export const createOrder = async (request, reply) => {
  try {
    const { items, shippingAddress, paymentMethod } = request.body;
    const userId = request.user.id;

    // Validação básica
    if (!items || !Array.isArray(items) || items.length === 0) {
      return reply.status(400).send({
        error: 'Itens do pedido são obrigatórios',
        code: 'MISSING_ITEMS'
      });
    }

    if (!shippingAddress) {
      return reply.status(400).send({
        error: 'Endereço de entrega é obrigatório',
        code: 'MISSING_ADDRESS'
      });
    }

    // Verificar se todos os produtos existem e calcular total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await database.getProductById(item.productId);
      if (!product) {
        return reply.status(404).send({
          error: `Produto ${item.productId} não encontrado`,
          code: 'PRODUCT_NOT_FOUND'
        });
      }

      // Verificar estoque
      if (product.stock < item.quantity) {
        return reply.status(400).send({
          error: `Estoque insuficiente para o produto ${product.title}`,
          code: 'INSUFFICIENT_STOCK'
        });
      }

      const itemPrice = parseFloat(product.price.replace('R$ ', '').replace(',', '.'));
      const itemTotal = itemPrice * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        total: `R$ ${itemTotal.toFixed(2).replace('.', ',')}`
      });
    }

    // Criar pedido
    const newOrder = await database.createOrder({
      userId,
      items: orderItems,
      totalAmount: `R$ ${totalAmount.toFixed(2).replace('.', ',')}`,
      shippingAddress,
      paymentMethod: paymentMethod || 'pending',
      status: 'pending',
      orderNumber: `HNV-${Date.now()}`
    });

    // Atualizar estoque dos produtos
    for (const item of items) {
      const product = await database.getProductById(item.productId);
      await database.updateProduct(item.productId, {
        stock: product.stock - item.quantity
      });
    }

    return reply.status(201).send({
      message: 'Pedido criado com sucesso',
      order: newOrder
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const getOrders = async (request, reply) => {
  try {
    const userId = request.user.id;
    const orders = await database.getOrdersByUserId(userId);

    return reply.send({ orders });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const getOrderById = async (request, reply) => {
  try {
    const { id } = request.params;
    const userId = request.user.id;
    
    const order = await database.getOrderById(id);

    if (!order) {
      return reply.status(404).send({
        error: 'Pedido não encontrado',
        code: 'ORDER_NOT_FOUND'
      });
    }

    // Verificar se o pedido pertence ao usuário
    if (order.userId !== userId) {
      return reply.status(403).send({
        error: 'Acesso negado',
        code: 'ACCESS_DENIED'
      });
    }

    return reply.send({ order });
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const updateOrderStatus = async (request, reply) => {
  try {
    const { id } = request.params;
    const { status } = request.body;
    const userId = request.user.id;

    if (!status) {
      return reply.status(400).send({
        error: 'Status é obrigatório',
        code: 'MISSING_STATUS'
      });
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return reply.status(400).send({
        error: 'Status inválido',
        code: 'INVALID_STATUS'
      });
    }

    const order = await database.getOrderById(id);

    if (!order) {
      return reply.status(404).send({
        error: 'Pedido não encontrado',
        code: 'ORDER_NOT_FOUND'
      });
    }

    // Verificar se o pedido pertence ao usuário (apenas para cancelamento)
    if (status === 'cancelled' && order.userId !== userId) {
      return reply.status(403).send({
        error: 'Acesso negado',
        code: 'ACCESS_DENIED'
      });
    }

    const updatedOrder = await database.updateOrder(id, { status });

    return reply.send({
      message: 'Status do pedido atualizado com sucesso',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
}; 