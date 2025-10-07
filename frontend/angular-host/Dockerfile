# =====================================================================
# ETAPA 1: Builder
# Usa uma imagem Node.js mais recente para resolver o "EBADENGINE".
# =====================================================================
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Otimização de Cache: Copia apenas os arquivos de dependência primeiro.
COPY package*.json ./

# Instala as dependências como o usuário correto
RUN npm install

# Agora copia o resto do código-fonte da aplicação.
COPY . .
# Expõe a porta em que a API será executada
EXPOSE 4200

# O comando para iniciar a aplicação será fornecido pelo docker-compose.yml
# A linha abaixo é a que provavelmente precisa ser corrigida
CMD [ "npm", "start" ]
