# ByteBank - Sistema de Controle Financeiro

Sistema de controle financeiro desenvolvido com Next.js (frontend) e Node.js/Express (backend), containerizado com Docker.

## 🚀 Funcionalidades

- ✅ **Autenticação de usuários** - Login e registro
- ✅ **Isolamento de dados** - Cada usuário vê apenas suas próprias transações
- ✅ **Proteção de rotas** - Acesso restrito apenas para usuários logados
- ✅ **Gestão de transações** - Criar, visualizar e gerenciar transações
- ✅ **Extrato bancário** - Visualizar histórico de transações
- ✅ **Interface responsiva** - Design moderno e mobile-friendly

## 🛠️ Tecnologias

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Context API para gerenciamento de estado

### Backend

- Node.js
- Express.js
- MongoDB
- JWT para autenticação
- Swagger para documentação da API

### Infraestrutura

- Docker & Docker Compose
- MongoDB (containerizado)

## 📋 Pré-requisitos

- Docker
- Docker Compose

## 🚀 Como executar

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd bytebank-fiap
```

### 2. Execute com Docker Compose

```bash
docker-compose up --build
```

### 3. Acesse a aplicação

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080
- **Documentação da API**: http://localhost:8080/docs
- **MongoDB**: localhost:27017

## 🔧 Configuração

### Variáveis de Ambiente

O projeto está configurado para funcionar automaticamente com Docker. As variáveis de ambiente são:

- `NEXT_PUBLIC_API_URL`: URL da API (configurada automaticamente para `http://localhost:3000`)
- `MONGODB_URI`: URI de conexão com MongoDB (configurada automaticamente para `mongodb://mongo:27017/bytebank`)

### Para desenvolvimento local (sem Docker)

Se quiser rodar localmente sem Docker:

1. **Backend**:

```bash
cd backend
npm install
npm run dev
```

2. **Frontend**:

```bash
cd frontend
npm install
npm run dev
```

3. **MongoDB**: Instale e configure um MongoDB local

## 📱 Como usar

### 1. Criar uma conta

- Acesse http://localhost:4200
- Clique em "Entrar" no header
- Mude para "Criar Conta"
- Preencha os dados e crie sua conta

### 2. Fazer login

- Use o email e senha criados
- Após o login, você será redirecionado para o dashboard

### 3. Gerenciar transações

- **Dashboard**: Visualize seu saldo e transações recentes
- **Nova transação**: Adicione depósitos ou transferências
- **Extrato**: Veja o histórico completo de transações
- **Filtros**: Filtre transações por tipo, data, etc.

## 🔒 Segurança

- **Autenticação JWT**: Tokens seguros com expiração de 12 horas
- **Isolamento de dados**: Cada usuário vê apenas seus próprios dados
- **Proteção de rotas**: Todas as páginas protegidas por autenticação
- **Validação de dados**: Validação tanto no frontend quanto no backend

## 📊 Estrutura do Projeto

```
bytebank-fiap/
├── frontend/                 # Aplicação Next.js
│   ├── src/
│   │   ├── app/             # Páginas e rotas
│   │   ├── components/      # Componentes React
│   │   ├── contexts/        # Context API
│   │   ├── services/        # Serviços de API
│   │   └── hooks/           # Custom hooks
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── controller/      # Controllers
│   │   ├── feature/         # Lógica de negócio
│   │   ├── infra/           # Infraestrutura (MongoDB)
│   │   ├── models/          # Modelos de dados
│   │   └── routes/          # Rotas da API
├── docker-compose.yml       # Configuração Docker
└── README.md
```

## 🐛 Solução de Problemas

### Erro de conexão com a API

- Verifique se o backend está rodando na porta 3000
- Confirme se a variável `NEXT_PUBLIC_API_URL` está correta

### Erro de conexão com MongoDB

- Verifique se o container do MongoDB está rodando
- Confirme se a variável `MONGODB_URI` está correta

### Problemas de build

- Execute `docker-compose down` e `docker-compose up --build` para rebuildar
- Verifique se não há conflitos de porta

## 📝 API Endpoints

### Autenticação

- `POST /user/auth` - Login
- `POST /user` - Registro
- `GET /user` - Listar usuários

### Contas e Transações

- `GET /account` - Obter dados da conta
- `POST /account/transaction` - Criar transação
- `GET /account/statement` - Obter extrato

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

Desenvolvido para o Tech Challenge FIAP - Fase 02.
