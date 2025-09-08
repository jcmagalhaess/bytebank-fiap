'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  const handleLogin = async (email: string, password: string) => {
    await auth.login({ email, password });
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    await auth.register({ username, email, password });
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        error: auth.error,
        login: handleLogin,
        register: handleRegister,
        logout: auth.logout,
        clearError: auth.clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
