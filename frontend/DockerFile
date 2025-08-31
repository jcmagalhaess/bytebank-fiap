# Usa a imagem oficial do Node.js, versão 20, com a distribuição Alpine
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de configuração para a instalação das dependências
COPY package*.json ./

# Instala todas as dependências do projeto
RUN npm install

# Copia o restante do código do projeto
COPY . .

# Expõe a porta que o Next.js vai usar
EXPOSE 4200

# Executa o projeto Next.js em modo de desenvolvimento
CMD ["npm", "run", "dev"]