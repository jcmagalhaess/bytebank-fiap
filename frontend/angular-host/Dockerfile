# Estágio 1: Build
# Use uma imagem base do Node.js
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
# Instala as dependências de build, executa o npm install e depois remove as dependências de build
RUN apk add --no-cache --virtual .build-deps build-base python3 && \
    npm install --no-optional && \
    apk del .build-deps

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta padrão do Angular
EXPOSE 4200

# Comando para iniciar o servidor de desenvolvimento do Angular
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
