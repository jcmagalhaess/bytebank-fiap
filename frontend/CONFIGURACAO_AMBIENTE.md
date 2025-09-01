# Configuração do Ambiente

## Variáveis de Ambiente

Para que a integração com o backend funcione corretamente, você precisa criar um arquivo `.env.local` na pasta `frontend` com a seguinte configuração:

### Para Desenvolvimento Local

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Para Docker

```env
NEXT_PUBLIC_API_URL=http://backend:3000
```

### Para Produção

```env
NEXT_PUBLIC_API_URL=https://sua-api-producao.com
```

## Como Criar o Arquivo

1. Na pasta `frontend`, crie um arquivo chamado `.env.local`
2. Adicione a linha com a URL da API conforme seu ambiente
3. Reinicie o servidor de desenvolvimento (`npm run dev`)

## Verificação

Para verificar se a configuração está funcionando:

1. Abra o console do navegador (F12)
2. Verifique se não há erros de CORS ou conexão
3. Teste fazer login e carregar transações

## Problemas Comuns

### Erro de CORS
- Certifique-se de que o backend está rodando
- Verifique se a URL está correta
- Confirme se o backend tem CORS configurado para aceitar requisições do frontend

### Erro de Conexão
- Verifique se o backend está rodando na porta correta
- Teste acessar a URL da API diretamente no navegador
- Verifique se não há firewall bloqueando a conexão
