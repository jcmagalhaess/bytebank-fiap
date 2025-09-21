'use client';

import { useAuthContext } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import AuthModal from './AuthModal';
import { PageLoader } from './ui/loader';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowAuthModal(true);
    } else if (isAuthenticated) {
      setShowAuthModal(false);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <PageLoader text="Carregando..." />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#E6F0FA] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#0A2A4D] mb-2">
                Acesso Restrito
              </h1>
              <p className="text-gray-600">
                Você precisa fazer login para acessar esta página.
              </p>
            </div>
            
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 font-semibold transition-colors"
            >
              Fazer Login
            </button>
          </div>
        </div>
        
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    );
  }

  return <>{children}</>;
}
