# 🚀 Deploy Rápido no Render

## ✅ Seu backend está PRONTO para o Render!

### **Configurações já incluídas:**
- ✅ Porta dinâmica (`process.env.PORT`)
- ✅ Host 0.0.0.0 para Render
- ✅ Health check endpoint (`/api/health`)
- ✅ Variáveis de ambiente configuradas
- ✅ Scripts corretos no package.json

---

## 📦 Passos para Deploy:

### **1. Suba para o GitHub:**
```bash
git add .
git commit -m "Ready for Render deploy"
git push origin main
```

### **2. No Render ([render.com](https://render.com)):**

1. **Login** com GitHub
2. **"New +"** → **"Web Service"**
3. **Conecte** seu repositório
4. **Configure:**

```
Name: hannover-backend
Root Directory: hannover-backend
Environment: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

5. **Variáveis de Ambiente:**
```
NODE_ENV = production
JWT_SECRET = YOUR_JWT_SECRET
GOOGLE_AI_API_KEY = YOUR_GOOGLE_AI_KEY
```

> 🔐 Use um `JWT_SECRET` longo e aleatório (ex.: `openssl rand -hex 32`) ou deixe o Render gerar o valor (o `render.yaml` já usa `generateValue: true`). Segredos ficam apenas nas variáveis de ambiente do Render, nunca no repositório.

6. **"Create Web Service"**

### **3. Aguarde o deploy (~2-3 min)**

✅ **URL final:** `https://hannover-backend.onrender.com`

---

## 🧪 Teste o Backend:

```bash
curl https://hannover-backend.onrender.com/api/health
```

**Resposta esperada:**
```json
{
  "status": "OK",
  "timestamp": "2024-..."
}
```

---

## 🌐 Próximo Passo: Frontend no Vercel

1. **Crie `.env` na raiz:**
```env
VITE_API_URL=https://hannover-backend.onrender.com
```

2. **Deploy no Vercel** com configuração Vite

---

**🎉 Pronto! Backend funcionando no Render gratuitamente!**