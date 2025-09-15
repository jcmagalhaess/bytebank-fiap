import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'gray';
  text?: string;
  className?: string;
}

export function Loader({ 
  size = 'md', 
  color = 'blue', 
  text,
  className = '' 
}: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    gray: 'border-gray-500'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      {/* Loader principal com múltiplas animações */}
      <div className="relative">
        {/* Círculo externo */}
        <div className={`${sizeClasses[size]} rounded-full border-2 border-gray-200`}></div>
        
        {/* Círculo animado */}
        <div className={`absolute top-0 left-0 ${sizeClasses[size]} rounded-full border-2 ${colorClasses[color]} border-t-transparent animate-spin`}></div>
        
        {/* Círculo interno pulsante */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${size === 'sm' ? 'h-1 w-1' : size === 'md' ? 'h-2 w-2' : 'h-3 w-3'} rounded-full ${colorClasses[color]} animate-pulse`}></div>
      </div>
      
      {/* Texto opcional */}
      {text && (
        <span className={`${textSizeClasses[size]} text-gray-600 font-medium animate-pulse`}>
          {text}
        </span>
      )}
    </div>
  );
}

// Loader específico para upload de PDF
export function PdfUploadLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Ícone de upload animado */}
      <div className="relative">
        <svg 
          className="w-4 h-4 text-blue-600 animate-bounce" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
          />
        </svg>
        
        {/* Círculo de progresso */}
        <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full animate-ping"></div>
      </div>
      
      <span className="text-sm text-blue-600 font-medium">Carregando...</span>
    </div>
  );
}

// Loader de página completa
export function PageLoader({ text = "Carregando..." }: { text?: string }) {
  return (
    <div className="min-h-screen bg-[#E6F0FA] flex items-center justify-center">
      <div className="text-center">
        {/* Logo com animação */}
        <div className="relative mb-8">
          {/* Círculo de fundo sutil */}
          <div className="absolute inset-0 w-24 h-24 rounded-full bg-white/20 mx-auto animate-pulse"></div>
          
          {/* Logo principal */}
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <img 
              src="/logo_bytebank_cropped.png" 
              alt="ByteBank" 
              className="w-10 h-10 object-contain animate-bounce"
              style={{ animationDuration: '2s' }}
            />
          </div>
          
          {/* Círculo de progresso ao redor do logo */}
          <div className="absolute inset-0 w-24 h-24 mx-auto">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Círculo de fundo */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#E5E7EB"
                strokeWidth="3"
                fill="none"
              />
              {/* Círculo de progresso animado */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#3B82F6"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset="70"
                className="animate-spin"
                style={{ animationDuration: '3s' }}
              />
            </svg>
          </div>
        </div>
        
        {/* Texto */}
        <p className="text-[#0A2A4D] text-lg font-semibold mb-2">{text}</p>
        
        {/* Pontos de carregamento */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
