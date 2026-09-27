# 👟 Hannover Store

Uma loja online moderna de produtos esportivos com funcionalidades de IA (chatbot) e visualização 3D de calçados.

🔗 **Demo:** [hannover-store.vercel.app](https://hannover-store.vercel.app)

## 🚀 Funcionalidades

### 🛍️ E-commerce
- ✅ Catálogo de produtos com filtros
- ✅ Carrinho de compras
- ✅ Sistema de autenticação
- ✅ Painel administrativo
- ✅ Gerenciamento de usuários

### 🤖 IA e Chatbot
- ✅ Chatbot "Hannovinho" com Google AI
- ✅ Recomendações de produtos
- ✅ Respostas inteligentes
- ✅ Configuração da chave de API pelo painel admin

### 📱 Realidade Aumentada
- ✅ Modelagem 3D de calçados
- ✅ Detecção de pé via câmera
- ✅ Visualização em tempo real
- ✅ Otimizado para dispositivos móveis

### ⚙️ Administração
- ✅ Dashboard completo
- ✅ CRUD de produtos e categorias
- ✅ Gerenciamento de usuários
- ✅ Configurações do sistema
- ✅ Estatísticas em tempo real

## 🛠️ Tecnologias

### Frontend
- **React 19** - Framework principal
- **Vite** - Build tool
- **React Router** - Roteamento
- **Bootstrap** - UI framework
- **CSS3** - Estilização

### Backend
- **Node.js** - Runtime
- **Fastify** - Framework web
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **JSON** - Armazenamento simples em arquivos

### IA e AR
- **Google AI Studio** - Chatbot inteligente
- **Canvas API** - Processamento de imagem
- **MediaDevices API** - Acesso à câmera
- **CSS 3D Transforms** - Renderização 3D

### Hospedagem
- **Vercel** - Frontend
- **Render** - Backend

## 📁 Estrutura do Projeto

```
HannoverStore/
├── hannover-backend/            # Backend (Render)
│   ├── src/
│   │   ├── server-unified.js    # Servidor principal (npm start)
│   │   ├── config.js            # Configuração (lê variáveis de ambiente)
│   │   ├── controllers/         # Controladores
│   │   ├── routes/              # Rotas da API
│   │   ├── middleware/          # Middlewares
│   │   └── utils/               # Utilitários
│   ├── data/                    # Dados JSON
│   │   ├── products.json        # Produtos
│   │   ├── users.json           # Usuários
│   │   ├── categories.json      # Categorias
│   │   ├── orders.json          # Pedidos
│   │   └── settings.json        # Configurações
│   ├── package.json
│   └── render.yaml              # Config Render
├── src/                         # Frontend (Vercel)
│   ├── components/              # Componentes React
│   │   ├── Chatbot/             # Chatbot com IA
│   │   ├── Shoe3DModeler/       # Modelagem 3D
│   │   ├── AdminSettings/       # Configurações admin
│   │   └── ...
│   ├── pages/                   # Páginas
│   ├── context/                 # Context API
│   ├── services/                # Serviços (cliente da API)
│   └── data/                    # Dados estáticos
├── package.json
├── vercel.json                  # Config Vercel
└── DEPLOY.md                    # Guia de deploy
```

## 🔐 Variáveis de Ambiente

Todos os segredos (chave JWT, chave da API do Google AI etc.) devem ficar **somente em variáveis de ambiente no servidor**, nunca no código nem no repositório. Os arquivos com valores reais (`.env`, `config.env`) não devem ser versionados.

### Backend (`hannover-backend`)

Localmente, crie o arquivo `hannover-backend/config.env` (carregado pelo backend via `dotenv`). Em produção, configure as mesmas variáveis no painel do Render.

```env
NODE_ENV=development
PORT=3002
JWT_SECRET=YOUR_JWT_SECRET
JWT_EXPIRES_IN=7d
GOOGLE_AI_API_KEY=YOUR_GOOGLE_AI_KEY
```

- `JWT_SECRET`: use um valor longo e aleatório (por exemplo, gerado com `openssl rand -hex 32`). No Render, o `render.yaml` já gera esse valor automaticamente.
- `GOOGLE_AI_API_KEY`: sua chave pessoal do [Google AI Studio](https://aistudio.google.com/app/apikey).

### Frontend (raiz do projeto)

Crie um arquivo `.env` na raiz (ou configure no painel da Vercel):

```env
VITE_API_URL=http://localhost:3002
```

> ⚠️ Variáveis com prefixo `VITE_` são embutidas no bundle e ficam visíveis no navegador. Nunca coloque segredos nelas.

## 🚀 Deploy

### Render (Backend)
1. Conecte o repositório no [Render](https://render.com)
2. Selecione o diretório `hannover-backend`
3. Configure as variáveis de ambiente (veja a seção acima)
4. Deploy automático

### Vercel (Frontend)
1. Conecte o repositório na [Vercel](https://vercel.com)
2. Configure a variável `VITE_API_URL` com a URL do backend no Render
3. Deploy automático

**📖 Guia completo:** [DEPLOY.md](./DEPLOY.md)

## 🔧 Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/arysson5/HannoverStore.git
cd HannoverStore

# Instalar dependências do frontend
npm install

# Instalar dependências do backend
cd hannover-backend
npm install
```

Depois, configure as variáveis de ambiente conforme a seção [Variáveis de Ambiente](#-variáveis-de-ambiente).

### Executar
```bash
# Frontend (terminal 1)
npm run dev

# Backend (terminal 2)
cd hannover-backend
npm run dev
```

## 🔐 Acesso Admin

O painel administrativo é restrito a usuários com a role `admin`. Nenhuma credencial é publicada neste repositório: crie seu próprio usuário administrador no ambiente local e use uma senha forte. Em produção, nunca mantenha contas com senhas padrão.

### Funcionalidades Admin
- Gerenciar produtos e categorias
- Visualizar usuários registrados
- Configurar a chave de API do Google AI
- Acessar estatísticas do sistema

## 🤖 Configuração do Chatbot

1. Obtenha uma chave no [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Defina a chave na variável de ambiente `GOOGLE_AI_API_KEY` do backend (local ou no Render), ou cadastre-a em **Painel Admin > Configurações**
3. O chatbot funcionará automaticamente

> A chave de API é um segredo: ela deve ficar apenas no servidor e nunca ser commitada nem exposta ao navegador.

## 📱 Modelagem 3D

### Como Usar
1. Abra o site em um dispositivo móvel
2. Navegue até qualquer produto
3. Clique no botão "👟 3D"
4. Permita acesso à câmera
5. Posicione seu pé na tela
6. Veja o tênis em 3D!

### Compatibilidade
- ✅ iOS Safari (iOS 11+)
- ✅ Android Chrome (Android 7+)
- ✅ Samsung Internet
- ✅ Firefox Mobile

## 🔍 API Endpoints

### Públicos
```
GET  /api/health              # Health check
GET  /api/products            # Listar produtos
GET  /api/categories          # Listar categorias
POST /api/auth/login          # Login
POST /api/auth/register       # Registro
```

### Admin (requer JWT de usuário admin)
```
GET    /api/admin/stats           # Estatísticas
GET    /api/admin/users           # Listar usuários
DELETE /api/admin/users/:id       # Deletar usuário
GET    /api/admin/google-ai-key   # Status da chave de API (configurada ou não)
POST   /api/admin/google-ai-key   # Salvar chave de API
DELETE /api/admin/google-ai-key   # Remover chave de API
POST   /api/admin/products        # Criar produto
PUT    /api/admin/products/:id    # Atualizar produto
DELETE /api/admin/products/:id    # Deletar produto
```

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] Sistema de pagamento
- [ ] Notificações push
- [ ] App mobile nativo
- [ ] Integração com redes sociais
- [ ] Sistema de avaliações
- [ ] Programa de fidelidade
- [ ] Chat em tempo real
- [ ] Análise de dados avançada

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Faça commit das suas mudanças (sem incluir arquivos `.env` ou `config.env`)
4. Faça push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 📞 Suporte

- **Email:** contato@hannoverstore.com
- **GitHub Issues:** [Abrir issue](https://github.com/arysson5/HannoverStore/issues)

---

**🎉 Desenvolvido com ❤️ para a Hannover Store**
