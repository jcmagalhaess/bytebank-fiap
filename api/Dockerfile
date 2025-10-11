# /home/juliomagalhaes/Documentos/bytebank-fiap/api/Dockerfile

# --- Estágio de Build ---
# Este estágio instala as devDependencies, compila o TypeScript e gera o Prisma Client.
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos de manifesto do projeto
COPY package.json package-lock.json ./

# Instala todas as dependências, incluindo as de desenvolvimento para o build
RUN npm install

# Copia o restante do código-fonte da aplicação
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Compila o TypeScript para JavaScript, criando a pasta /dist
RUN npm run build


# --- Estágio de Produção ---
# Este estágio cria uma imagem final menor, apenas com o necessário para rodar.
FROM node:18-alpine AS production

WORKDIR /app

# Copia os arquivos de manifesto novamente
COPY package.json package-lock.json ./

# Instala APENAS as dependências de produção
RUN npm install --omit=dev

# Copia o schema do Prisma para a imagem final para que o migrate funcione
COPY --from=builder /app/prisma ./prisma

# **A ETAPA MAIS IMPORTANTE: Copia o código compilado (pasta dist) do estágio de build**
COPY --from=builder /app/dist ./dist

# Expõe a porta que a aplicação usa
EXPOSE 3333

# Comando que o App Runner irá executar.
# Primeiro, ele aplica as migrações do banco e depois inicia o servidor.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
