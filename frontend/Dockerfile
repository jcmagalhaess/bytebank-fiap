# STAGE 1: COMPILAÇÃO
# Esta etapa instala as dependências de desenvolvimento e compila a aplicação.
FROM node:20-alpine AS builder

WORKDIR /app

# Instala as dependências e o "npm" para compilar o projeto
COPY package*.json ./
RUN npm install

# Copia todo o código do projeto
COPY . .

# Constrói o projeto Next.js para produção
RUN npm run build

# STAGE 2: PRODUÇÃO
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Define a variável de ambiente PORT
ENV PORT=4200

EXPOSE 4200

CMD ["node", "server.js"]