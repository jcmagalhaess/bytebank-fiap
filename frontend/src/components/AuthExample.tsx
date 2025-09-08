'use client';

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { TransactionService } from '../app/services/transactionService';

export default function AuthExample() {
  const { user, isAuthenticated, isLoading, error, login, logout, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  const handleLoadTransactions = async () => {
    setLoadingTransactions(true);
    try {
      // Exemplo: carrega transações da primeira conta disponível
      const accounts = await TransactionService.getAccounts();
      if (accounts.length > 0) {
        const accountTransactions = await TransactionService.list(accounts[0].id);
        setTransactions(accountTransactions);
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  if (isLoading) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Exemplo de Integração com Backend</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button onClick={clearError} className="ml-2 text-red-500">×</button>
        </div>
      )}

      {!isAuthenticated ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p>Logado como: {user?.username || user?.email}</p>
          </div>
          
          <button
            onClick={handleLoadTransactions}
            disabled={loadingTransactions}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loadingTransactions ? 'Carregando...' : 'Carregar Transações'}
          </button>

          {transactions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Transações:</h3>
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="p-2 border rounded">
                    <p><strong>Tipo:</strong> {transaction.type}</p>
                    <p><strong>Valor:</strong> R$ {transaction.amount}</p>
                    <p><strong>Data:</strong> {transaction.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
