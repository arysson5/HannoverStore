# 📚 Documentação da API - Hannover Store

## 🌐 Informações Gerais

- **Base URL**: `http://localhost:3002`
- **Documentação Interativa**: `http://localhost:3002/documentation`
- **Formato**: JSON
- **Autenticação**: JWT Bearer Token

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Para acessar endpoints protegidos, inclua o token no header:

```
Authorization: Bearer <seu-token-jwt>
```

## 📋 Endpoints

### 🔑 Autenticação (`/api/auth`)

#### POST `/api/auth/register`
Registrar um novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```

**Resposta (201):**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "1234567890",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "customer",
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/api/auth/login`
Fazer login na aplicação.

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

**Resposta (200):**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": "1234567890",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET `/api/auth/profile` 🔒
Buscar perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "user": {
    "id": "1234567890",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "customer",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

#### PUT `/api/auth/profile` 🔒
Atualizar perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "João Santos Silva",
  "email": "joao.santos@email.com"
}
```

### 📦 Produtos (`/api/products`)

#### GET `/api/products`
Listar produtos com filtros e paginação.

**Query Parameters:**
- `category` (string): Filtrar por categoria
- `featured` (string): Filtrar produtos em destaque (true/false)
- `search` (string): Buscar por texto no título ou descrição
- `page` (integer): Número da página (padrão: 1)
- `limit` (integer): Itens por página (padrão: 10, máximo: 50)
- `sortBy` (string): Campo para ordenação (padrão: createdAt)
- `sortOrder` (string): Ordem da classificação (asc/desc, padrão: desc)

**Exemplo:**
```
GET /api/products?category=smartphones&featured=true&page=1&limit=10
```

**Resposta (200):**
```json
{
  "products": [
    {
      "id": "1",
      "title": "Smartphone Samsung Galaxy A54",
      "description": "Smartphone Samsung Galaxy A54 5G 128GB 6GB RAM Tela 6.4'' Câmera Tripla 50MP",
      "price": "R$ 1.299,99",
      "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
      "category": "smartphones",
      "stock": 15,
      "featured": true,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

#### GET `/api/products/:id`
Buscar produto específico por ID.

**Resposta (200):**
```json
{
  "product": {
    "id": "1",
    "title": "Smartphone Samsung Galaxy A54",
    "description": "Smartphone Samsung Galaxy A54 5G 128GB 6GB RAM Tela 6.4'' Câmera Tripla 50MP",
    "price": "R$ 1.299,99",
    "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    "category": "smartphones",
    "stock": 15,
    "featured": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

#### POST `/api/products` 🔒
Criar um novo produto (requer autenticação).

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "iPhone 15 Pro",
  "description": "iPhone 15 Pro 256GB Titânio Natural",
  "price": "R$ 8.999,99",
  "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
  "category": "smartphones",
  "stock": 10,
  "featured": true
}
```

#### PUT `/api/products/:id` 🔒
Atualizar produto existente (requer autenticação).

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "iPhone 15 Pro Max",
  "price": "R$ 10.999,99",
  "stock": 5
}
```

#### DELETE `/api/products/:id` 🔒
Deletar produto (requer autenticação).

**Headers:**
```
Authorization: Bearer <token>
```

### 🛒 Pedidos (`/api/orders`)

#### POST `/api/orders` 🔒
Criar um novo pedido (requer autenticação).

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "items": [
    {
      "productId": "1",
      "quantity": 2
    },
    {
      "productId": "2",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "Rua das Flores, 123",
    "number": "123",
    "complement": "Apto 45",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234567"
  },
  "paymentMethod": "credit_card"
}
```

**Resposta (201):**
```json
{
  "message": "Pedido criado com sucesso",
  "order": {
    "id": "1234567890",
    "userId": "user123",
    "orderNumber": "HNV-1234567890",
    "items": [
      {
        "productId": "1",
        "title": "Smartphone Samsung Galaxy A54",
        "price": "R$ 1.299,99",
        "quantity": 2,
        "total": "R$ 2.599,98"
      }
    ],
    "totalAmount": "R$ 2.599,98",
    "status": "pending",
    "shippingAddress": { ... },
    "paymentMethod": "credit_card",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

#### GET `/api/orders` 🔒
Listar pedidos do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

#### GET `/api/orders/:id` 🔒
Buscar pedido específico por ID.

**Headers:**
```
Authorization: Bearer <token>
```

#### PATCH `/api/orders/:id/status` 🔒
Atualizar status do pedido.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "status": "confirmed"
}
```

**Status válidos:**
- `pending` - Pendente
- `confirmed` - Confirmado
- `processing` - Processando
- `shipped` - Enviado
- `delivered` - Entregue
- `cancelled` - Cancelado

### 🏷️ Categorias (`/api/categories`)

#### GET `/api/categories`
Listar todas as categorias.

**Resposta (200):**
```json
{
  "categories": [
    {
      "id": "smartphones",
      "name": "Smartphones",
      "description": "Smartphones e celulares",
      "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"
    },
    {
      "id": "notebooks",
      "name": "Notebooks",
      "description": "Notebooks e laptops",
      "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"
    }
  ]
}
```

#### GET `/api/categories/:id`
Buscar categoria específica por ID.

## 🚨 Códigos de Status HTTP

### Sucesso
- `200` - OK (operação bem-sucedida)
- `201` - Created (recurso criado com sucesso)

### Erro do Cliente
- `400` - Bad Request (dados inválidos)
- `401` - Unauthorized (não autenticado)
- `403` - Forbidden (sem permissão)
- `404` - Not Found (recurso não encontrado)
- `409` - Conflict (conflito, ex: email já existe)

### Erro do Servidor
- `500` - Internal Server Error (erro interno)

## 📝 Exemplos de Uso com cURL

### Registrar Usuário
```bash
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "123456"
  }'
```

### Buscar Produtos
```bash
curl http://localhost:3002/api/products
```

### Buscar Produtos com Filtros
```bash
curl "http://localhost:3002/api/products?category=smartphones&featured=true&page=1&limit=5"
```

### Criar Produto (com autenticação)
```bash
curl -X POST http://localhost:3002/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{
    "title": "iPhone 15 Pro",
    "description": "iPhone 15 Pro 256GB",
    "price": "R$ 8.999,99",
    "category": "smartphones",
    "stock": 10,
    "featured": true
  }'
```

### Criar Pedido (com autenticação)
```bash
curl -X POST http://localhost:3002/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{
    "items": [
      {
        "productId": "1",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "street": "Rua das Flores, 123",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01234567"
    }
  }'
```

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente
```bash
PORT=3002
HOST=0.0.0.0
JWT_SECRET=hannover-store-secret-key-2024
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### Executar Servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📊 Estrutura de Resposta de Erro

Todas as respostas de erro seguem o padrão:

```json
{
  "error": "Descrição do erro",
  "code": "CODIGO_DO_ERRO",
  "details": {} // Opcional, para erros de validação
}
```

### Códigos de Erro Comuns
- `MISSING_FIELDS` - Campos obrigatórios não fornecidos
- `VALIDATION_ERROR` - Erro de validação de dados
- `MISSING_TOKEN` - Token de autenticação não fornecido
- `INVALID_TOKEN` - Token inválido
- `EXPIRED_TOKEN` - Token expirado
- `USER_NOT_FOUND` - Usuário não encontrado
- `EMAIL_EXISTS` - Email já cadastrado
- `INVALID_CREDENTIALS` - Credenciais inválidas
- `PRODUCT_NOT_FOUND` - Produto não encontrado
- `ORDER_NOT_FOUND` - Pedido não encontrado
- `CATEGORY_NOT_FOUND` - Categoria não encontrada
- `INSUFFICIENT_STOCK` - Estoque insuficiente
- `ACCESS_DENIED` - Acesso negado
- `INTERNAL_ERROR` - Erro interno do servidor

## 🚀 Próximas Funcionalidades

- [ ] Upload de imagens para produtos
- [ ] Sistema de avaliações e comentários
- [ ] Cupons de desconto
- [ ] Integração com gateway de pagamento
- [ ] Notificações por email
- [ ] Sistema de favoritos
- [ ] Histórico de preços
- [ ] Relatórios de vendas

---

**Documentação gerada automaticamente pelo Swagger em:** `http://localhost:3002/documentation` 