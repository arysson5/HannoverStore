# 🚀 Guia de Deploy - Hannover Store

## 📦 Deploy do Backend no Render (GRATUITO)

### **Passo 1: Preparar o repositório**
```bash
git add .
git commit -m "Deploy ready for Render"
git push origin main
```

### **Passo 2: Configurar no Render**

1. **Acesse [render.com](https://render.com)** e faça login com GitHub
2. **Clique em "New +"** → **"Web Service"**
3. **Conecte seu repositório** GitHub
4. **Configure o serviço:**

```
Name: hannover-backend
Root Directory: hannover-backend
Environment: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

5. **Adicione as Variáveis de Ambiente:**
```
NODE_ENV = production
JWT_SECRET = hannover-store-secret-2024-render
```

6. **Clique em "Create Web Service"**

### **Passo 3: Aguardar o deploy**
- ⏱️ Primeiro deploy: ~2-3 minutos
- ✅ URL será: `https://hannover-backend.onrender.com`
- 🔍 Teste: `https://hannover-backend.onrender.com/api/health`

---

## 🌐 Deploy do Frontend no Vercel

### **Passo 1: Configurar URL do backend**

Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=https://hannover-backend.onrender.com
```

### **Passo 2: Deploy no Vercel**

1. **Acesse [vercel.com](https://vercel.com)**
2. **Conecte seu GitHub**
3. **Selecione o repositório**
4. **Configure:**
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

5. **Adicione a variável de ambiente:**
```
VITE_API_URL = https://hannover-backend.onrender.com
```

6. **Deploy automático!** ✅

---

## 🔧 URLs Finais

Após o deploy completo:
- **🌐 Frontend**: `https://seu-projeto.vercel.app`
- **⚙️ Backend**: `https://hannover-backend.onrender.com`
- **❤️ Health Check**: `https://hannover-backend.onrender.com/api/health`

---

## ⚠️ Importante sobre o Render Gratuito

- **💤 Sleep**: Serviço "dorme" após 15 min sem uso
- **🐌 Cold Start**: Primeira requisição pode demorar ~30s
- **✅ Solução**: Usar um serviço de ping ou upgrade para plano pago

---

## 🧪 Testando o Deploy

### Backend:
```bash
curl https://hannover-backend.onrender.com/api/health
```

### Frontend:
- Acesse sua URL do Vercel
- Teste login/registro
- Teste carrinho de compras
- Teste filtros de produtos

---

**🎉 Pronto! Sua loja está online e funcionando!** 