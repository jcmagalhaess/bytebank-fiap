import { useState, useEffect, useCallback } from 'react';
import { AuthService, LoginRequest, RegisterRequest, User } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await AuthService.login(credentials);
      
      // Busca os dados do usuário após o login
      const user = await AuthService.getCurrentUser();
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no login';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await AuthService.register(userData);
      
      // Busca os dados do usuário após o registro
      const user = await AuthService.getCurrentUser();
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no registro';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Verifica se o usuário está autenticado ao carregar a aplicação
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const isValid = await AuthService.validateToken();
          if (isValid) {
            const user = await AuthService.getCurrentUser();
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    };

    checkAuth();
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    clearError,
  };
};
