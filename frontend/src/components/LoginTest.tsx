'use client';

import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function LoginTest() {
  const [email, setEmail] = useState('teste@gmail.com');
  const [password, setPassword] = useState('testes');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, isAuthenticated, error } = useAuthContext();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(email, password);
      console.log('Login realizado com sucesso!');
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <h3 className="text-green-800 font-semibold mb-2">✅ Usuário Logado!</h3>
        <p className="text-green-700">
          <strong>Nome:</strong> {user.username}
        </p>
        <p className="text-green-700">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="text-green-700">
          <strong>ID:</strong> {user.id}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="text-blue-800 font-semibold mb-3">🔐 Teste de Login</h3>
      
      <div className="space-y-3">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="teste@gmail.com"
        />
        
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="testes"
        />
        
        <Button
          variant="primary"
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Fazendo Login...' : 'Fazer Login'}
        </Button>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}
      </div>
      
      <div className="mt-3 text-sm text-blue-600">
        <p><strong>Usuários de teste:</strong></p>
        <p>• Email: teste@gmail.com | Senha: testes</p>
        <p>• Email: teste@teste.com | Senha: 123456</p>
      </div>
    </div>
  );
}
