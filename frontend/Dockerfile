# Usa a imagem oficial do Node.js, versão 20, com a distribuição Alpine
FROM node:20-alpine AS base

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Instala as dependências do projeto
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Copia o restante do código do projeto
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# O stage final, que contém apenas os arquivos de produção
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

# Define a porta que o servidor vai usar
ENV PORT 4200

# Copia apenas os arquivos de produção do stage anterior
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next/static ./.next/static

# Expõe a porta que o servidor vai usar
EXPOSE 4200

# O comando para iniciar a aplicação em produção
CMD ["npm", "run", "dev"]
