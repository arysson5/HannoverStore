# 🧪 Guia para Testar a Aplicação Hannover Store

## 📋 Pré-requisitos

1. **Node.js** instalado (versão 18+)
2. **Git** instalado
3. **Terminal/PowerShell** aberto

## 🚀 Como Testar a Aplicação

### 1. **Iniciar o Backend**

```bash
# Navegar para o diretório do backend
cd hannover-backend

# Instalar dependências (se necessário)
npm install

# Iniciar o servidor backend
npm start
```

**✅ Verificar se está funcionando:**
- Deve aparecer: `🚀 Servidor Hannover Store rodando na porta 3002`
- Acesse: http://localhost:3002/api/health

### 2. **Iniciar o Frontend** (em outro terminal)

```bash
# Voltar para o diretório raiz
cd ..

# Instalar dependências (se necessário)
npm install

# Iniciar o servidor frontend
npm run dev
```

**✅ Verificar se está funcionando:**
- Deve aparecer: `Local: http://localhost:3000/`
- Acesse: http://localhost:3000

### 3. **Testar Funcionalidades**

#### **A. Teste Básico**
1. Acesse http://localhost:3000
2. Verifique se a página carrega
3. Navegue pelas páginas

#### **B. Teste de Login**
1. Clique em "Login" ou "Entrar"
2. Use as credenciais:
   - **Email:** `admin@hannover.com`
   - **Senha:** `password`
3. Verifique se o login funciona

#### **C. Teste de Admin**
1. Após fazer login como admin
2. Acesse a página de administração
3. Teste as funcionalidades admin

#### **D. Teste de Configuração da Chave API**
1. Faça login como admin
2. Vá para "Configurações" ou `/admin/settings`
3. Tente configurar a chave API do Google AI

## 🔧 Solução de Problemas

### **Problema 1: Backend não inicia**
```bash
# Verificar se a porta 3002 está livre
netstat -ano | findstr :3002

# Se estiver ocupada, matar o processo
taskkill /PID <PID_NUMBER> /F
```

### **Problema 2: Frontend não inicia**
```bash
# Verificar se a porta 3000 está livre
netstat -ano | findstr :3000

# Se estiver ocupada, matar o processo
taskkill /PID <PID_NUMBER> /F
```

### **Problema 3: Erro de CORS**
- Verifique se o backend está rodando na porta 3002
- Verifique se o frontend está rodando na porta 3000

### **Problema 4: Erro de autenticação**
- Verifique se está usando `authToken` no localStorage
- Verifique se o token está sendo enviado corretamente

## 📊 Scripts de Teste

### **Testar Backend Local**
```bash
node test-local-app.js
```

### **Testar Servidor Render**
```bash
node test-render-server.js
```

### **Testar Endpoints Completos**
```bash
cd hannover-backend
node test-endpoints.js
```

## 🎯 URLs Importantes

- **Frontend Local:** http://localhost:3000
- **Backend Local:** http://localhost:3002
- **Backend Render:** https://hannover-backend.onrender.com
- **Health Check:** http://localhost:3002/api/health

## 📱 Funcionalidades para Testar

### **✅ Funcionalidades Básicas**
- [ ] Navegação entre páginas
- [ ] Listagem de produtos
- [ ] Listagem de categorias
- [ ] Carrinho de compras
- [ ] Login/Registro

### **✅ Funcionalidades Admin**
- [ ] Dashboard admin
- [ ] Gerenciar usuários
- [ ] Gerenciar produtos
- [ ] Configurar chave API
- [ ] Estatísticas

### **✅ Funcionalidades Avançadas**
- [ ] Chatbot
- [ ] Modelagem 3D
- [ ] Notificações
- [ ] Filtros de produtos

## 🚨 Problemas Conhecidos

1. **Chave API não configurada** - Normal, precisa ser configurada pelo admin
2. **Alguns endpoints podem retornar 404** - Verificar se o backend está atualizado
3. **Erro de CORS** - Verificar se ambos os servidores estão rodando
4. **VITE_API_URL undefined** - ✅ CORRIGIDO: Agora usa fallback para localhost:3002

## 🔧 Correções Aplicadas

### **Problema: URL incorreta no AdminSettings**
- **Erro:** `http://localhost:3000/admin/undefined/api/admin/google-ai-key`
- **Causa:** `import.meta.env.VITE_API_URL` retornando `undefined`
- **Solução:** Adicionado fallback `|| 'http://localhost:3002'` em todos os arquivos
- **Arquivos corrigidos:**
  - `src/components/AdminSettings/AdminSettings.jsx`
  - `src/components/Chatbot/Chatbot.jsx`

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do terminal
2. Abra o DevTools (F12) e verifique o console
3. Teste os endpoints diretamente
4. Verifique se ambos os servidores estão rodando
