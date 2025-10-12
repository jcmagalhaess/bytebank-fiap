# /home/juliomagalhaes/Documentos/bytebank-fiap/api/Dockerfile

# --- Estágio de Build ---
# Este estágio instala as devDependencies, compila o TypeScript e gera o Prisma Client.
FROM node:18-alpine AS builder

WORKDIR /

# Copia os arquivos de manifesto do projeto
COPY package*.json ./

# Instala todas as dependências, incluindo as de desenvolvimento para o build
RUN npm install

# Copia o restante do código-fonte da aplicação
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Compila o TypeScript para JavaScript, criando a pasta /dist
RUN npm run build

# Primeiro, ele aplica as migrações do banco e depois inicia o servidor.
CMD ["npm", "run", "dev"]
