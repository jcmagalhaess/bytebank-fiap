# Integração Frontend com Backend

Este documento explica como usar a integração entre o frontend Next.js e o backend Node.js.

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na pasta `frontend` com:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Estrutura de Arquivos Criados

```
frontend/src/
├── config/
│   └── api.ts                    # Configuração da API
├── services/
│   ├── api.ts                    # Serviço base para requisições HTTP
│   ├── authService.ts            # Serviço de autenticação
│   └── transactionApiService.ts  # Serviço específico para transações
├── hooks/
│   └── useAuth.ts                # Hook para gerenciar autenticação
└── components/
    └── AuthExample.tsx           # Exemplo de uso da integração
```

## Como Usar

### 1. Autenticação

```tsx
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email: 'user@example.com', password: 'password' });
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Bem-vindo, {user?.username}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### 2. Transações

```tsx
import { TransactionService } from '../app/services/transactionService';

// Carregar transações
const transactions = await TransactionService.list('account-id');

// Criar nova transação
const newTransaction = await TransactionService.add({
  type: 'deposit',
  amount: 100,
  date: '2024-01-01',
  categoria: 'Salário'
});

// Obter contas do usuário
const accounts = await TransactionService.getAccounts();
```

### 3. Requisições HTTP Diretas

```tsx
import { ApiService } from '../services/api';

// GET
const data = await ApiService.get('/endpoint');

// POST
const result = await ApiService.post('/endpoint', { data: 'value' });

// PUT
const updated = await ApiService.put('/endpoint', { data: 'value' });

// DELETE
await ApiService.delete('/endpoint');
```

## Funcionalidades

### ✅ Implementado

- [x] Configuração de URL da API
- [x] Serviço base para requisições HTTP
- [x] Autenticação com JWT
- [x] Hook para gerenciar estado de autenticação
- [x] Integração com transações
- [x] Fallback para localStorage quando API não disponível
- [x] Tratamento de erros
- [x] Validação de token

### 🔄 Fallback Automático

O sistema foi projetado para funcionar mesmo quando o backend não estiver disponível:

1. **Transações**: Se a API falhar, usa localStorage automaticamente
2. **Autenticação**: Se o token for inválido, faz logout automático
3. **Erros**: Todos os erros são tratados graciosamente

## Endpoints do Backend

### Autenticação (Público)
- `POST /user/auth` - Login
- `POST /user` - Registro
- `GET /user` - Listar usuários

### Transações (Protegido - requer token)
- `GET /account` - Listar contas
- `POST /account/transaction` - Criar transação
- `GET /account/:accountId/statement` - Obter extrato

## Como Testar

1. **Inicie o backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Inicie o frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Teste a integração:**
   - Acesse `http://localhost:4200`
   - Use o componente `AuthExample` para testar login
   - Teste carregar transações

## Docker

Para usar com Docker, certifique-se de que as URLs estejam configuradas corretamente:

```env
NEXT_PUBLIC_API_URL=http://backend:3000
```

## Próximos Passos

1. Implementar refresh token
2. Adicionar interceptors para requisições
3. Implementar cache de dados
4. Adicionar testes unitários
5. Implementar loading states globais
