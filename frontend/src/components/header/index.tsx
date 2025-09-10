"use client";

import Image from "next/image";
import { AvatarIcon } from "../icons/avatarIcon";
import Link from "next/link";
import { useAuthContext } from "../../contexts/AuthContext";
import { useState } from "react";
import AuthModal from "../AuthModal";

export function Header() {
  const { user, isAuthenticated, logout } = useAuthContext();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="w-full h-[80px] bg-brandSecondary text-backgroundPrimary px-lg py-sm flex items-center justify-between font-inter">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo_bytebank.png"
            alt="Bytebank Logo"
            width={180}
            height={32}
            priority
            className="cursor-pointer"
          />
        </Link>

        {/* Nome do usuário e avatar */}
        <div className="flex items-center gap-xs">
          {isAuthenticated && user ? (
            <>
              <span className="text-sm hidden sm:inline">{user.username}</span>
              <div className="relative group">
                <AvatarIcon
                  className="text-backgroundPrimary text-[26px] cursor-pointer"
                  bgColor="bg-transparent"
                  size="w-[36px] h-[36px]"
                />
                {/* Dropdown menu */}
                <div className="right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {user.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Entrar
            </button>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}
