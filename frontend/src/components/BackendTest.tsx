'use client';

import { useState } from 'react';
import { ApiService } from '../services/api';
import { API_CONFIG } from '../config/api';

export default function BackendTest() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);
    
    const tests = [
      {
        name: 'Teste 1: Buscar usuários (sem autenticação)',
        test: async () => {
          const response = await ApiService.get(API_CONFIG.ENDPOINTS.USERS);
          return response;
        }
      },
      {
        name: 'Teste 2: Criar usuário',
        test: async () => {
          const userData = {
            username: 'Teste Frontend',
            email: 'teste@frontend.com',
            password: '123456'
          };
          const response = await ApiService.post(API_CONFIG.ENDPOINTS.REGISTER, userData);
          return response;
        }
      },
             {
         name: 'Teste 3: Login',
         test: async () => {
           const loginData = {
             email: 'teste@frontend.com',
             password: '123456'
           };
           const response = await ApiService.post(API_CONFIG.ENDPOINTS.LOGIN, loginData);
           // O token está em response.result.token, não response.data.token
           if (response.result?.token) {
             ApiService.setAuthToken(response.result.token);
           }
           return response;
         }
       },
      {
        name: 'Teste 4: Buscar contas (com autenticação)',
        test: async () => {
          const response = await ApiService.get(API_CONFIG.ENDPOINTS.ACCOUNT);
          return response;
        }
      }
    ];

    for (const test of tests) {
      try {
        const result = await test.test();
        setTestResults(prev => [...prev, {
          name: test.name,
          status: 'success',
          result: result
        }]);
      } catch (error) {
        setTestResults(prev => [...prev, {
          name: test.name,
          status: 'error',
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        }]);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Teste de Integração com Backend</h2>
      
      <button
        onClick={runTests}
        disabled={loading}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Executando testes...' : 'Executar Testes'}
      </button>

      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div key={index} className={`p-4 rounded border ${
            result.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <h3 className={`font-semibold ${
              result.status === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {result.name}
            </h3>
            {result.status === 'success' ? (
              <pre className="mt-2 text-sm bg-white p-2 rounded border overflow-auto">
                {JSON.stringify(result.result, null, 2)}
              </pre>
            ) : (
              <p className="mt-2 text-red-600">{result.error}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Informações da API:</h3>
        <p><strong>URL Base:</strong> {API_CONFIG.BASE_URL}</p>
        <p><strong>Endpoints:</strong></p>
        <ul className="ml-4 list-disc">
          <li>Login: {API_CONFIG.ENDPOINTS.LOGIN}</li>
          <li>Registro: {API_CONFIG.ENDPOINTS.REGISTER}</li>
          <li>Usuários: {API_CONFIG.ENDPOINTS.USERS}</li>
          <li>Contas: {API_CONFIG.ENDPOINTS.ACCOUNT}</li>
          <li>Transações: {API_CONFIG.ENDPOINTS.TRANSACTION}</li>
        </ul>
      </div>
    </div>
  );
}
