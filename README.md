# ByteBank - Sistema de Controle Financeiro

Sistema de controle financeiro com frontend em Angular (arquitetura de micro frontends: host e remote) e backend em Node.js/Express com Prisma e PostgreSQL, containerizado com Docker.

[Assista ao vídeo no YouTube](https://www.youtube.com/watch?v=aNWfAj2hJGk)

[Layout no Figma](https://www.figma.com/design/iEFswemmf7cQVTA4tHygZn/Tech-Challenge--2?node-id=0-1&t=nvpqaIFXIvrkzy83-1)

[Acesso a aplicação na Vercel](https://bytebank-fiap-ps41.vercel.app/)


## 🚀 Funcionalidades

- ✅ **Autenticação de usuários** - Login e registro
- ✅ **Isolamento de dados** - Cada usuário vê apenas suas próprias transações
- ✅ **Proteção de rotas** - Acesso restrito apenas para usuários logados
- ✅ **Gestão de transações** - Criar, visualizar e gerenciar transações
- ✅ **Extrato bancário** - Visualizar histórico de transações
- ✅ **Interface responsiva** - Design moderno e mobile-friendly

## 🛠️ Tecnologias

### Frontend

- Angular 20 (aplicações `angular-host` e `angular-remote`)
- TypeScript
- Tailwind CSS (no host)
- Module Federation (Native Federation)

### Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT para autenticação
- Swagger (OpenAPI) para documentação da API

### Infraestrutura

- Docker & Docker Compose
- PostgreSQL (containerizado)

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

- **Angular Host**: http://localhost:4200
- **Angular Remote**: http://localhost:4201
- **Backend API**: http://localhost:3333
- **Documentação da API (Swagger)**: http://localhost:3333/api-docs
- **PostgreSQL**: localhost:5432 (usuário: `bytebank`, senha: `bytebank-2025`, db: `bytebank_db`)

## 🔧 Configuração

### Variáveis de Ambiente (API)

O projeto está configurado para funcionar automaticamente com Docker. Para executar localmente (ou customizar), configure as variáveis na pasta `api`:

- `DATABASE_URL`: URL de conexão do PostgreSQL (Prisma). Exemplo (Docker):
  `postgresql://bytebank:bytebank-2025@db:5432/bytebank_db?schema=public`
- `JWT_SECRET`: segredo para assinatura dos tokens JWT
- (Opcional) Variáveis para storage S3 se os recibos forem enviados para S3

### Para desenvolvimento local (sem Docker)

Se quiser rodar localmente sem Docker:

1. **API (Node/Express/Prisma)**

```bash
cd api
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

2. **Frontend Angular Host**

```bash
cd frontend/angular-host
npm install
npm run start
```

3. **Frontend Angular Remote**

```bash
cd frontend/angular-remote
npm install
npm run start
```

4. **Banco de dados**: Utilize um PostgreSQL local (ex.: Postgres 14) e aponte `DATABASE_URL` adequadamente, ou suba somente o serviço `db` do `docker-compose`.

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
├── api/                      # API Node.js/Express + Prisma (PostgreSQL)
│   ├── src/
│   │   ├── controllers/      # Controllers
│   │   ├── services/         # Regras de negócio
│   │   ├── routes/           # Rotas da API
│   │   ├── middlewares/      # Middlewares (inclui Swagger)
│   │   └── lib/              # Prisma client e helpers
│   └── prisma/               # Schema e migrações
├── frontend/
│   ├── angular-host/         # App Angular principal (porta 4200)
│   └── angular-remote/       # App Angular remoto (porta 4201)
├── docker-compose.yml        # Orquestração Docker
└── README.md
```

## 🐛 Solução de Problemas

### Erro de conexão com a API

- Verifique se a API está rodando na porta 3333
- Confirme se a `DATABASE_URL` e `JWT_SECRET` estão configuradas

### Erro de conexão com o PostgreSQL

- Verifique se o container do PostgreSQL está rodando (`db`)
- Confirme se as credenciais do banco batem com a `DATABASE_URL`

### Problemas de build

- Execute `docker-compose down` e `docker-compose up --build` para rebuildar
- Verifique se não há conflitos nas portas 3333, 4200, 4201, 5432
- Em caso de erros do Prisma, rode `npx prisma generate` e `npx prisma migrate deploy`

## 📝 API Endpoints (principais)

### Usuários

- `POST /users` - Registro
- `POST /users/login` - Login
- `GET /users/me` - Perfil do usuário autenticado

### Transações

- `GET /transactions` - Listar transações
- `GET /transactions/summary` - Resumo
- `GET /transactions/yearly-summary` - Resumo anual
- `POST /transactions` - Criar transação
- `PATCH /transactions/{id}` - Atualizar transação
- `GET /transactions/{id}/receipt` - Visualizar recibo
- `GET /transactions/{id}/receipt/download` - Download de recibo
- `DELETE /transactions/{id}` - Remover transação

## 👥 Equipe

- [Priscilla Correa](https://github.com/prissycorrea)
- [Júlio Magalhães](https://github.com/jcmagalhaess)
- [Mauro Rodrigues de Melo](https://github.com/mauromelo)

Desenvolvido para o Tech Challenge FIAP - Fase 02.
