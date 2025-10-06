# =====================================================================
# ETAPA 1: Builder
# Usa uma imagem Node.js mais recente para resolver o "EBADENGINE".
# =====================================================================
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Otimização de Cache: Copia apenas os arquivos de dependência primeiro.
# O Docker só vai re-executar o 'npm install' se estes arquivos mudarem.
COPY package*.json ./

# Instala as dependências
RUN npm install

# Agora copia o resto do código-fonte da aplicação.
# Alterações no código não invalidarão o cache do 'npm install'.
COPY . .
