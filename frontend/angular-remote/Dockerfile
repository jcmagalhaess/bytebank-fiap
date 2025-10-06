# =====================================================================
# ETAPA 1: Builder
# Usa uma imagem Node.js mais recente para resolver o "EBADENGINE".
# =====================================================================
FROM node:20-alpine AS builder

# Argumentos para UID/GID para corrigir permissões
ARG UID=1000
ARG GID=1000

# Cria um usuário e grupo não-root com os IDs corretos ANTES de qualquer outra coisa
RUN addgroup -g ${GID} --system appgroup && \
    adduser -u ${UID} --system appuser -G appgroup

# Define o diretório de trabalho
WORKDIR /app

# Otimização de Cache: Copia apenas os arquivos de dependência primeiro.
# O Docker só vai re-executar o 'npm install' se estes arquivos mudarem.
COPY package*.json ./
RUN chown -R appuser:appgroup .

# Muda para o usuário não-root
USER appuser

# Instala as dependências como o usuário correto
RUN npm install --no-optional

# Agora copia o resto do código-fonte da aplicação.
COPY . .
