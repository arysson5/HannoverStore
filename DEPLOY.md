# 🚀 Guia de Deploy - Hannover Store

## 📋 Estrutura do Projeto

```
HannoverStore/
├── hannover-backend/          # Backend (Render)
│   ├── src/
│   ├── data/
│   ├── package.json
│   └── render.yaml
├── src/                       # Frontend (Vercel)
├── package.json
├── vercel.json
└── DEPLOY.md
```

## 🎯 Deploy no Render (Backend)

### 1. Preparação
- ✅ Arquivo `render.yaml` configurado
- ✅ `package.json` com script `start` correto
- ✅ Backend usando `src/server-simple.js`

### 2. Deploy no Render
1. **Acesse:** [render.com](https://render.com)
2. **Conecte seu repositório GitHub**
3. **Selecione o diretório:** `hannover-backend`
4. **Configurações automáticas:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`
   - Plan: `Free`

### 3. Variáveis de Ambiente no Render
```bash
NODE_ENV=production
JWT_SECRET=seu-jwt-secret-aqui
PORT=10000
```

### 4. URL do Backend
Após o deploy, você receberá uma URL como:
```
https://hannover-backend-xxxx.onrender.com
```

## 🌐 Deploy no Vercel (Frontend)

### 1. Preparação
- ✅ Arquivo `vercel.json` configurado
- ✅ Script `vercel-build` no package.json
- ✅ Build otimizado para produção

### 2. Deploy no Vercel
1. **Acesse:** [vercel.com](https://vercel.com)
2. **Conecte seu repositório GitHub**
3. **Selecione o projeto raiz** (não o hannover-backend)
4. **Configure as variáveis de ambiente:**
   ```
   VITE_API_URL=https://hannover-backend-xxxx.onrender.com
   ```

### 3. Configurações do Vercel
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## 🔧 Configuração Pós-Deploy

### 1. Configurar Chave API do Google AI
1. **Acesse:** `https://seu-site.vercel.app/admin`
2. **Faça login como admin:**
   - Email: `admin@hannover.com`
   - Senha: `password`
3. **Vá para Configurações**
4. **Adicione sua chave API do Google AI**

### 2. Testar Funcionalidades
- ✅ Login/Registro
- ✅ Produtos e categorias
- ✅ Carrinho de compras
- ✅ Chatbot com IA
- ✅ Modelagem 3D (mobile)
- ✅ Painel admin

## 📱 URLs de Acesso

### Frontend (Vercel)
```
https://hannover-store.vercel.app
```

### Backend (Render)
```
https://hannover-backend-xxxx.onrender.com
```

### Endpoints Principais
```
GET  /api/health                    # Health check
GET  /api/products                  # Listar produtos
GET  /api/categories                # Listar categorias
POST /api/auth/login                # Login
POST /api/auth/register             # Registro
GET  /api/admin/users               # Usuários (admin)
POST /api/admin/google-ai-key       # Configurar API key (admin)
```

## 🛠️ Comandos Úteis

### Desenvolvimento Local
```bash
# Frontend
npm run dev

# Backend
cd hannover-backend
npm run dev
```

### Build para Produção
```bash
# Frontend
npm run build

# Backend
cd hannover-backend
npm start
```

## 🔍 Troubleshooting

### Problemas Comuns

#### 1. CORS Errors
- ✅ CORS configurado no backend
- ✅ URLs corretas nas variáveis de ambiente

#### 2. 404 Errors
- ✅ Verificar se o backend está rodando
- ✅ Verificar URL da API no frontend

#### 3. Chatbot não funciona
- ✅ Configurar chave API do Google AI
- ✅ Verificar logs do backend

#### 4. Deploy falha
- ✅ Verificar se todas as dependências estão no package.json
- ✅ Verificar scripts de build
- ✅ Verificar variáveis de ambiente

## 📊 Monitoramento

### Render (Backend)
- **Logs:** Dashboard do Render
- **Health Check:** `/api/health`
- **Uptime:** Monitoramento automático

### Vercel (Frontend)
- **Analytics:** Dashboard do Vercel
- **Performance:** Core Web Vitals
- **Deployments:** Histórico de deploys

## 🔐 Segurança

### Variáveis Sensíveis
- ✅ JWT_SECRET gerado automaticamente
- ✅ Chave API do Google AI no backend
- ✅ CORS configurado corretamente

### Acesso Admin
- ✅ Apenas usuários com role 'admin'
- ✅ Autenticação JWT obrigatória
- ✅ Endpoints protegidos

## 📈 Próximos Passos

1. **Configurar domínio personalizado**
2. **Implementar CI/CD**
3. **Adicionar monitoramento**
4. **Otimizar performance**
5. **Implementar cache**

---

**🎉 Seu sistema está pronto para produção!**