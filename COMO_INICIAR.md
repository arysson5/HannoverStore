# 🚀 Como Iniciar a Hannover Store

## Opção 1: Scripts Automáticos (Recomendado)

### Windows (Batch)
```bash
# Execute o arquivo start-servers.bat
./start-servers.bat
```

### Windows (PowerShell)
```powershell
# Execute o script PowerShell
./start-servers.ps1
```

## Opção 2: Manual

### 1. Iniciar o Backend
```bash
# Abra um terminal e navegue para o backend
cd hannover-backend

# Instale as dependências (apenas na primeira vez)
npm install

# Inicie o servidor
npm start
```

O backend estará rodando em: **http://localhost:3002**

### 2. Iniciar o Frontend
```bash
# Abra outro terminal na raiz do projeto
# (não feche o terminal do backend)

# Instale as dependências (apenas na primeira vez)
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em: **http://localhost:3000**

## 🔧 Verificação

### Testar Backend
Acesse: http://localhost:3002/api/health

Deve retornar:
```json
{
  "status": "OK",
  "timestamp": "2024-..."
}
```

### Testar Frontend
Acesse: http://localhost:3000

Deve carregar a loja com produtos da API.

## 📋 Endpoints da API

- **GET** `/api/products` - Listar produtos
- **GET** `/api/categories` - Listar categorias  
- **POST** `/api/auth/register` - Registrar usuário
- **POST** `/api/auth/login` - Fazer login
- **POST** `/api/orders` - Criar pedido (requer autenticação)

## 🛠️ Troubleshooting

### Erro de porta ocupada
Se a porta 3002 estiver ocupada:
```bash
# Encontrar processo usando a porta
netstat -ano | findstr :3002

# Matar o processo (substitua PID pelo número encontrado)
taskkill /PID <PID> /F
```

### Erro de dependências
```bash
# Limpar cache e reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Erro de CORS
O backend já está configurado com CORS. Se ainda houver problemas, verifique se ambos os servidores estão rodando nas portas corretas.

## 📁 Estrutura do Projeto

```
HannoverStore/
├── hannover-backend/          # API Backend
│   ├── src/
│   │   ├── server-simple.js   # Servidor principal
│   │   └── ...
│   ├── data/                  # Banco JSON
│   │   ├── products.json
│   │   ├── categories.json
│   │   └── ...
│   └── package.json
├── src/                       # Frontend React
│   ├── components/
│   ├── context/
│   ├── services/
│   └── ...
├── start-servers.bat          # Script Windows
├── start-servers.ps1          # Script PowerShell
└── package.json
```

## ✅ Funcionalidades Implementadas

- ✅ API REST completa
- ✅ Autenticação JWT
- ✅ CRUD de produtos
- ✅ Sistema de carrinho
- ✅ Filtros e busca
- ✅ Interface responsiva
- ✅ Integração frontend/backend
- ✅ Notificações
- ✅ Loading states 