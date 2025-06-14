# Hannover Store

Uma loja virtual moderna de calçados esportivos construída com React e Vite.

## 🚀 Funcionalidades

- **Catálogo de Produtos**: Navegação por categorias (tênis, chuteiras, sandálias, botas)
- **Sistema de Carrinho**: Adicionar/remover produtos com animações
- **Autenticação**: Login e registro de usuários
- **Painel Admin**: Gerenciamento de produtos e categorias (CRUD completo)
- **Portal de Dicas**: Guias sobre tipos de pisada e escolha de calçados
- **Filtros Avançados**: Por categoria, marca, preço e busca textual
- **Design Responsivo**: Funciona perfeitamente em desktop e mobile

## 🚀 Deploy Completo (Frontend + Backend)

### ✅ Seu projeto ESTÁ PRONTO para deploy!

## 📦 Deploy do Backend no Render (GRATUITO)

### **Passo 1: Preparar o repositório**
```bash
git add .
git commit -m "Deploy ready for Render"
git push origin main
```

### **Passo 2: Deploy no Render**

1. **Acesse [render.com](https://render.com)** e faça login com GitHub
2. **Clique em "New +"** → **"Web Service"**
3. **Conecte seu repositório** GitHub
4. **Configure o serviço:**
   - **Name**: `hannover-backend`
   - **Root Directory**: `hannover-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. **Variáveis de Ambiente:**
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `hannover-store-secret-2024-render`
   - `PORT` = (deixe vazio - Render define automaticamente)

6. **Clique em "Create Web Service"**

### **Passo 3: Aguardar o deploy**
- ⏱️ Primeiro deploy: ~2-3 minutos
- ✅ URL será algo como: `https://hannover-backend.onrender.com`

## 🌐 Deploy do Frontend no Vercel

### **Passo 1: Configurar URL do backend**

Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=https://seu-backend.onrender.com
```

### **Passo 2: Deploy no Vercel**

1. **Acesse [vercel.com](https://vercel.com)**
2. **Conecte seu GitHub**
3. **Configure:**
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Adicione a variável de ambiente:**
   - `VITE_API_URL` = `https://seu-backend.onrender.com`

## ⚡ Configurações Incluídas

### Backend (Render):
- ✅ Configuração de porta dinâmica
- ✅ Host 0.0.0.0 para Render
- ✅ Health check endpoint
- ✅ Variáveis de ambiente
- ✅ CORS configurado

### Frontend (Vercel):
- ✅ `vercel.json` - Roteamento SPA
- ✅ Build otimizado com Vite
- ✅ Configuração de variáveis de ambiente

## 🔧 URLs Finais

Após o deploy, você terá:
- **Frontend**: `https://seu-projeto.vercel.app`
- **Backend**: `https://hannover-backend.onrender.com`
- **API Health**: `https://hannover-backend.onrender.com/api/health`

## 🛠️ Tecnologias

- React 19 + Vite
- React Router DOM
- Bootstrap 5
- Fastify (backend)

## 📦 Desenvolvimento Local

```bash
# Frontend
npm install
npm run dev

# Backend (terminal separado)
cd hannover-backend
npm install
npm start
```

## ⚠️ Importante sobre o Render Gratuito

- **Sleep após inatividade**: O serviço "dorme" após 15 minutos sem uso
- **Cold start**: Primeira requisição pode demorar ~30 segundos
- **Solução**: Usar um serviço de ping ou upgrade para plano pago

---

**🎯 Resultado:** Sua loja completa funcionando online gratuitamente!

## 🚀 Deploy no Vercel

### ✅ Seu projeto ESTÁ PRONTO para o Vercel!

**Passos para fazer o deploy:**

1. **Suba para o GitHub:**
```bash
git add .
git commit -m "Deploy ready"
git push origin main
```

2. **No Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Conecte seu GitHub
   - Selecione o repositório
   - Configure:
     - Framework: **Vite**
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Deploy automático!** ✨

## 📦 Deploy do Backend no Render (GRATUITO)

### **Passo a passo completo:**

1. **Acesse [render.com](https://render.com)** e faça login com GitHub
2. **Clique em "New +"** → **"Web Service"**
3. **Conecte seu repositório** GitHub
4. **Configure:**
   - **Name**: `hannover-backend`
   - **Root Directory**: `hannover-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. **Variáveis de Ambiente:**
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `hannover-store-secret-2024`

6. **Deploy automático!** ✅

**URL final:** `https://hannover-backend.onrender.com`

### 🔧 Configurações Incluídas

- ✅ `vercel.json` - Roteamento SPA
- ✅ `package.json` - Scripts corretos
- ✅ `vite.config.js` - Configuração otimizada

## 🛠️ Tecnologias

- **Frontend**: React 19, React Router DOM, Bootstrap 5
- **Backend**: Fastify (Node.js)
- **Autenticação**: JWT + bcrypt
- **Build Tool**: Vite
- **Styling**: CSS3 + Bootstrap

## 📦 Instalação Local

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/hannover-store.git
cd hannover-store
```

2. Instale as dependências do frontend:
```bash
npm install
```

3. Instale as dependências do backend:
```bash
cd hannover-backend
npm install
cd ..
```

4. Inicie os servidores:
```bash
# Opção 1: Script automático (Windows)
./start-servers.ps1

# Opção 2: Manual
# Terminal 1 - Backend
cd hannover-backend
npm start

# Terminal 2 - Frontend
npm run dev
```

5. Acesse:
- Frontend: http://localhost:3000
- Backend: http://localhost:3002

## 🌐 Deploy no Vercel

### Preparação do Projeto

1. **Certifique-se de que todos os arquivos estão commitados**:
```bash
git add .
git commit -m "Preparando para deploy"
git push origin main
```

2. **Estrutura necessária**:
- ✅ `vercel.json` (já criado)
- ✅ `package.json` com scripts de build
- ✅ Configuração do Vite

### Deploy do Frontend

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "New Project"
3. Conecte seu repositório GitHub
4. Configure o projeto:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (raiz do projeto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Deploy do Backend

Para o backend, você tem algumas opções:

#### Opção 1: Railway
1. Acesse [railway.app](https://railway.app)
2. Conecte seu GitHub
3. Deploy o diretório `hannover-backend`
4. Configure as variáveis de ambiente

#### Opção 2: Render
1. Acesse [render.com](https://render.com)
2. Crie um novo Web Service
3. Conecte seu repositório
4. Configure:
   - **Root Directory**: `hannover-backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

#### Opção 3: Heroku
```bash
# No diretório hannover-backend
heroku create seu-app-backend
git subtree push --prefix hannover-backend heroku main
```

### Configuração de URLs

Após o deploy do backend, atualize as URLs no frontend:

1. Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=https://seu-backend.railway.app
```

2. Atualize o arquivo de configuração da API se necessário.

## 🔧 Configurações Importantes

### Variáveis de Ambiente

**Frontend (.env)**:
```env
VITE_API_URL=http://localhost:3002
```

**Backend (.env)**:
```env
PORT=3002
JWT_SECRET=seu_jwt_secret_super_seguro
```

### Arquivos Importantes

- `vercel.json`: Configuração do Vercel para SPA routing
- `vite.config.js`: Configuração do Vite
- `package.json`: Scripts e dependências

## 👤 Contas de Teste

**Admin**:
- Email: `admin@hannover.com`
- Senha: `hello`

**Usuário**:
- Email: `test@admin.com`
- Senha: `test123`

## 🎯 Funcionalidades Principais

### Para Usuários
- Navegação por produtos
- Filtros e busca
- Carrinho de compras
- Portal de dicas sobre calçados

### Para Administradores
- Gerenciamento de produtos
- Gerenciamento de categorias
- Dashboard administrativo

## 📱 Responsividade

O projeto é totalmente responsivo e funciona em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (até 767px)

## 🚀 Performance

- Lazy loading de imagens
- Otimização de bundle com Vite
- CSS otimizado
- Componentes React otimizados

## 📄 Licença

Este projeto está sob a licença MIT.

---

Desenvolvido com ❤️ para a Hannover Store