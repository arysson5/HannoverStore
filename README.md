# 👟 Hannover Store

Uma loja online moderna de produtos esportivos com funcionalidades avançadas de IA e realidade aumentada.

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
- ✅ Configuração de API key por admin

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
- **CSS3** - Estilização avançada

### Backend
- **Node.js** - Runtime
- **Fastify** - Framework web
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **JSON** - Banco de dados simples

### IA e AR
- **Google AI Studio** - Chatbot inteligente
- **Canvas API** - Processamento de imagem
- **MediaDevices API** - Acesso à câmera
- **CSS 3D Transforms** - Renderização 3D

## 📁 Estrutura do Projeto

```
HannoverStore/
├── hannover-backend/          # Backend (Render)
│   ├── src/
│   │   ├── server-simple.js   # Servidor principal
│   │   ├── controllers/       # Controladores
│   │   ├── routes/           # Rotas da API
│   │   ├── middleware/       # Middlewares
│   │   └── utils/            # Utilitários
│   ├── data/                 # Dados JSON
│   │   ├── products.json     # Produtos
│   │   ├── users.json        # Usuários
│   │   ├── categories.json   # Categorias
│   │   └── settings.json     # Configurações
│   ├── package.json
│   └── render.yaml           # Config Render
├── src/                      # Frontend (Vercel)
│   ├── components/           # Componentes React
│   │   ├── Chatbot/         # Chatbot com IA
│   │   ├── Shoe3DModeler/   # Modelagem 3D
│   │   ├── AdminSettings/   # Configurações admin
│   │   └── ...
│   ├── pages/               # Páginas
│   ├── context/             # Context API
│   ├── services/            # Serviços
│   └── data/                # Dados estáticos
├── package.json
├── vercel.json              # Config Vercel
└── DEPLOY.md                # Guia de deploy
```

## 🚀 Deploy

### Render (Backend)
1. Conecte o repositório no [Render](https://render.com)
2. Selecione o diretório `hannover-backend`
3. Configure as variáveis de ambiente
4. Deploy automático

### Vercel (Frontend)
1. Conecte o repositório no [Vercel](https://vercel.com)
2. Configure a variável `VITE_API_URL`
3. Deploy automático

**📖 Guia completo:** [DEPLOY.md](./DEPLOY.md)

## 🔧 Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/hannover-store.git
cd hannover-store

# Instalar dependências do frontend
npm install

# Instalar dependências do backend
cd hannover-backend
npm install
```

### Executar
```bash
# Frontend (terminal 1)
npm run dev

# Backend (terminal 2)
cd hannover-backend
npm run dev
```

## 🔐 Acesso Admin

### Credenciais Padrão
- **Email:** `admin@hannover.com`
- **Senha:** `password`

### Funcionalidades Admin
- Gerenciar produtos e categorias
- Visualizar usuários registrados
- Configurar chave API do Google AI
- Acessar estatísticas do sistema

## 🤖 Configuração do Chatbot

1. Acesse o painel admin
2. Vá para Configurações
3. Adicione sua chave API do Google AI
4. O chatbot funcionará automaticamente

**Obter chave:** [Google AI Studio](https://makersuite.google.com/app/apikey)

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
GET  /api/google-ai-key       # Chave API (pública)
```

### Admin
```
GET    /api/admin/stats           # Estatísticas
GET    /api/admin/users           # Listar usuários
DELETE /api/admin/users/:id       # Deletar usuário
GET    /api/admin/google-ai-key   # Status da chave API
POST   /api/admin/google-ai-key   # Salvar chave API
DELETE /api/admin/google-ai-key   # Remover chave API
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

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email:** contato@hannoverstore.com
- **GitHub Issues:** [Abrir issue](https://github.com/seu-usuario/hannover-store/issues)

---

**🎉 Desenvolvido com ❤️ para a Hannover Store**