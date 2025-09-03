# 🚀 Como Configurar o Backend no Vercel

## ✅ O que já foi feito:
- ✅ Código atualizado para usar `VITE_API_URL`
- ✅ URLs hardcoded removidas
- ✅ Commit e push realizados

## 🔧 Próximos passos no Vercel:

### 1. Acesse seu projeto no Vercel
- Vá para [vercel.com](https://vercel.com)
- Abra seu projeto da Hannover Store

### 2. Configure a variável de ambiente
- Vá em **Settings** → **Environment Variables**
- Clique em **Add New**
- Configure:
  ```
  Name: VITE_API_URL
  Value: https://hannover-backend.onrender.com
  ```
- Marque: **Production**, **Preview** e **Development**
- Clique em **Save**

### 3. Force um redeploy
- Vá em **Deployments**
- Clique nos três pontos do último deployment
- Clique em **Redeploy**

### 4. Teste a conexão
- Acesse sua URL do Vercel
- Teste se os produtos aparecem
- Teste login/registro

## 🔍 URLs para testar:
- **Frontend**: `https://seu-projeto.vercel.app`
- **Backend**: `https://hannover-backend.onrender.com/api/health`

## ⚠️ Possíveis problemas:

### Backend "dormindo" (Render gratuito)
- Primeira requisição pode demorar ~30 segundos
- Solução: Aguardar ou acessar o backend diretamente primeiro

### CORS
- Se aparecer erro de CORS, verifique se o backend está configurado corretamente
- O backend deve permitir requisições do seu domínio Vercel

## 🎉 Resultado esperado:
- ✅ Produtos carregando normalmente
- ✅ Login/registro funcionando
- ✅ Sem erros de "localhost:3002"
- ✅ Todas as funcionalidades operando com o backend no Render 