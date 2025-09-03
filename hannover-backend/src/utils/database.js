import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class JSONDatabase {
  constructor() {
    this.dataPath = path.join(__dirname, '../../data');
  }

  async readFile(filename) {
    try {
      const filePath = path.join(this.dataPath, filename);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async writeFile(filename, data) {
    const filePath = path.join(this.dataPath, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  }

  // Produtos
  async getProducts() {
    return await this.readFile('products.json');
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(product => product.id === id);
  }

  async createProduct(product) {
    const products = await this.getProducts();
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.push(newProduct);
    await this.writeFile('products.json', products);
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex(product => product.id === id);
    if (index === -1) return null;
    
    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await this.writeFile('products.json', products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filteredProducts = products.filter(product => product.id !== id);
    if (filteredProducts.length === products.length) return false;
    
    await this.writeFile('products.json', filteredProducts);
    return true;
  }

  // Usuários
  async getUsers() {
    return await this.readFile('users.json');
  }

  async getUserById(id) {
    const users = await this.getUsers();
    return users.find(user => user.id === id);
  }

  async getUserByEmail(email) {
    const users = await this.getUsers();
    return users.find(user => user.email === email);
  }

  async getAllUsers() {
    return await this.getUsers();
  }

  async createUser(user) {
    const users = await this.getUsers();
    const newUser = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    await this.writeFile('users.json', users);
    return newUser;
  }

  async updateUser(id, updates) {
    const users = await this.getUsers();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await this.writeFile('users.json', users);
    return users[index];
  }

  // Pedidos
  async getOrders() {
    return await this.readFile('orders.json');
  }

  async getOrderById(id) {
    const orders = await this.getOrders();
    return orders.find(order => order.id === id);
  }

  async getOrdersByUserId(userId) {
    const orders = await this.getOrders();
    return orders.filter(order => order.userId === userId);
  }

  async createOrder(order) {
    const orders = await this.getOrders();
    const newOrder = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    orders.push(newOrder);
    await this.writeFile('orders.json', orders);
    return newOrder;
  }

  async updateOrder(id, updates) {
    const orders = await this.getOrders();
    const index = orders.findIndex(order => order.id === id);
    if (index === -1) return null;
    
    orders[index] = {
      ...orders[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await this.writeFile('orders.json', orders);
    return orders[index];
  }

  // Categorias
  async getCategories() {
    return await this.readFile('categories.json');
  }

  async getCategoryById(id) {
    const categories = await this.getCategories();
    return categories.find(category => category.id === id);
  }
}

export default new JSONDatabase(); 