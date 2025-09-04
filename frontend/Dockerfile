# Usa a imagem oficial do Node.js, versão 20, com a distribuição Alpine
FROM node:20-alpine AS base

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Instala as dependências de desenvolvimento e produção
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Copia o restante do código do projeto
COPY . .

# Constrói o projeto para produção
RUN npm run build

# O stage final, que contém apenas os arquivos de produção
FROM base AS runner
WORKDIR /app

# Copia apenas os arquivos de produção do stage anterior
COPY --from=builder /app/.next/standalone ./

# Define a variável de ambiente PORT para que o servidor Next.js use a porta 4200
ENV PORT=4200

# Expõe a porta 4200
EXPOSE 4200

# O comando para iniciar a aplicação
CMD ["npm", "run", "dev"]
