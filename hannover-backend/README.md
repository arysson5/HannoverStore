# Hannover Store - Backend API

Backend da aplicação Hannover Store desenvolvido com Node.js e Fastify.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Fastify** - Framework web rápido e eficiente
- **JSON Database** - Banco de dados em arquivo JSON (temporário)
- **JWT** - Autenticação com JSON Web Tokens
- **bcryptjs** - Hash de senhas
- **CORS** - Configuração de CORS

## 📁 Estrutura do Projeto

```
src/
├── controllers/     # Controladores da aplicação
├── middleware/      # Middlewares (autenticação, etc.)
├── routes/          # Definição das rotas
├── services/        # Serviços de negócio
├── utils/           # Utilitários (database, helpers)
├── config.js        # Configurações da aplicação
└── server.js        # Arquivo principal do servidor

data/
├── products.json    # Dados dos produtos
├── users.json       # Dados dos usuários
├── orders.json      # Dados dos pedidos
└── categories.json  # Dados das categorias
```

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação
```bash
# Instalar dependências
npm install
```

### Execução
```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

O servidor estará disponível em: `http://localhost:3001`

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login do usuário
- `GET /api/auth/profile` - Buscar perfil (autenticado)
- `PUT /api/auth/profile` - Atualizar perfil (autenticado)

### Produtos
- `GET /api/products` - Listar produtos (público)
- `GET /api/products/:id` - Buscar produto por ID (público)
- `POST /api/products` - Criar produto (autenticado)
- `PUT /api/products/:id` - Atualizar produto (autenticado)
- `DELETE /api/products/:id` - Deletar produto (autenticado)

### Pedidos
- `POST /api/orders` - Criar pedido (autenticado)
- `GET /api/orders` - Listar pedidos do usuário (autenticado)
- `GET /api/orders/:id` - Buscar pedido por ID (autenticado)
- `PATCH /api/orders/:id/status` - Atualizar status do pedido (autenticado)

### Categorias
- `GET /api/categories` - Listar categorias (público)
- `GET /api/categories/:id` - Buscar categoria por ID (público)

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Para acessar rotas protegidas, inclua o token no header:

```
Authorization: Bearer <seu-token-jwt>
```

## 📝 Exemplos de Uso

### Registrar Usuário
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "123456"
  }'
```

### Buscar Produtos
```bash
curl http://localhost:3001/api/products
```

### Criar Pedido
```bash
curl -X POST http://localhost:3001/api/orders \
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

## 🗄️ Banco de Dados

Atualmente, a aplicação utiliza arquivos JSON como banco de dados temporário. Os dados são armazenados na pasta `data/`:

- `products.json` - Produtos da loja
- `users.json` - Usuários cadastrados
- `orders.json` - Pedidos realizados
- `categories.json` - Categorias de produtos

### Migração para Banco Real

Para migrar para um banco de dados real (PostgreSQL, MySQL, MongoDB), será necessário:

1. Instalar o driver do banco escolhido
2. Atualizar o arquivo `src/utils/database.js`
3. Configurar as variáveis de ambiente
4. Criar as tabelas/collections necessárias

## 🔧 Configuração

As configurações podem ser alteradas através de variáveis de ambiente:

```bash
PORT=3001                    # Porta do servidor
HOST=0.0.0.0                # Host do servidor
JWT_SECRET=sua-chave-secreta # Chave secreta do JWT
JWT_EXPIRES_IN=7d           # Tempo de expiração do token
CORS_ORIGIN=http://localhost:3000 # Origem permitida para CORS
```

## 🚀 Deploy

Para deploy em produção:

1. Configure as variáveis de ambiente
2. Execute `npm start`
3. Configure um proxy reverso (nginx, apache)
4. Configure SSL/HTTPS

## 📄 Licença

Este projeto está sob a licença ISC. 