# Usa a imagem oficial do Node.js, versão 18, com a distribuição bullseye
FROM node:18-bullseye

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de configuração para a instalação das dependências
COPY package*.json ./

# Instala todas as dependências do projeto, incluindo 'jsonwebtoken'
RUN npm install

# Copia o restante do código do projeto
COPY . .

# Define a porta que o Node.js vai usar
ENV PORT=8080

# Expõe a porta para o mundo exterior
EXPOSE 8080

# Executa o projeto Node.js em modo de produção
CMD ["npm", "start"]
