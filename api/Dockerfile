# Use uma imagem base do Node.js. A versão alpine é leve.
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o package.json e package-lock.json (ou yarn.lock, etc.)
# Isso aproveita o cache do Docker, reinstalando dependências apenas se esses arquivos mudarem.
COPY package*.json ./

# Copia o schema do Prisma para garantir que o cliente seja gerado corretamente
COPY prisma ./prisma/

# Instala as dependências do projeto
# Instala as dependências de build, executa o npm install e depois remove as dependências de build
RUN apk add --no-cache --virtual .build-deps build-base python3 && \
    npm install --no-optional && \
    npm cache clean --force && \
    apk del .build-deps

# Copia o restante do código-fonte da aplicação para o diretório de trabalho
COPY . .

# Expõe a porta em que a API será executada
EXPOSE 3333

# O comando para iniciar a aplicação será fornecido pelo docker-compose.yml
# A linha abaixo é a que provavelmente precisa ser corrigida
CMD [ "node", "dist/server.js" ]