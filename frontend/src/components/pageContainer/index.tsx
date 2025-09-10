"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { ArrowRightIcon } from "../icons/arrowRightIcon";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type PageContainerVariant = "highlight" | "sectioned" | "form";

type PageContainerProps = {
  children?: React.ReactNode;
  className?: string;
  bgColor?: string;
  withBackgroundPattern?: boolean;
  variant?: PageContainerVariant;
  title?: string;
  subtitle?: string;
  exibirExtratoLink?: boolean;
  exibirBotaoVoltar?: boolean;
};

export function PageContainer({
  children,
  className = "",
  bgColor = "bg-white",
  withBackgroundPattern = false,
  variant,
  title,
  subtitle,
  exibirExtratoLink = true,
  exibirBotaoVoltar = false,
}: PageContainerProps) {
  const router = useRouter();
  const baseClasses = "relative p-4 sm:p-10 mb-6 w-full";
  const pathname = usePathname();

  const variantClasses = {
    highlight: clsx(
      "text-white flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0 sm:p-10 p-6 w-screen",
      "bg-gradient-to-r from-brandSecondary via-brandPrimary to-brandSecondary h-[250px]",
      "relative overflow-hidden -mx-4 sm:-mx-10"
    ),
    sectioned: clsx(
      "bg-white/60 shadow-md rounded-xl p-4 sm:p-6 w-full h-[100%]",
      "flex flex-col gap-md"
    ),
    form: clsx("bg-backgroundPrimary rounded-xl p-4 sm:p-6 shadow-md"),
  };

  const renderHighlight = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-[50%] mx-auto">
      <div className="flex flex-col gap-sm z-10">
        <h1 className="text-xl sm:text-h1 font-bold text-backgroundPrimary font-jakarta">
          {title}
        </h1>
        {pathname === "/" && (
          <p className="text-base sm:text-h4 text-backgroundPrimary font-jakarta -mt-2">
            Seja bem-vindo(a) de volta
          </p>
        )}
      </div>
      
      {/* Links de navegação */}
      <nav className="flex z-10 relative">
        <Link 
          href="/" 
          className={`font-jakarta transition-colors relative pb-2 px-6 ${
            pathname === "/" 
              ? "text-white" 
              : "text-gray-300 hover:text-white"
          }`}
        >
          Home
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
            pathname === "/" ? "bg-white" : "bg-gray-400"
          }`}></div>
        </Link>
        <Link 
          href="/transactions" 
          className={`font-jakarta transition-colors relative pb-2 px-6 ${
            pathname === "/transactions" 
              ? "text-white" 
              : "text-gray-300 hover:text-white"
          }`}
        >
          Transações
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
            pathname === "/transactions" ? "bg-white" : "bg-gray-400"
          }`}></div>
        </Link>
        <Link 
          href="/budget" 
          className={`font-jakarta transition-colors relative pb-2 px-6 ${
            pathname === "/budget" 
              ? "text-white" 
              : "text-gray-300 hover:text-white"
          }`}
        >
          Orçamento
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
            pathname === "/budget" ? "bg-white" : "bg-gray-400"
          }`}></div>
        </Link>
      </nav>
    </div>
  );

  const backgroundNoise = (
    <div className="absolute inset-0 z-0 opacity-50 bg-[url('/Noise.png')] bg-center pointer-events-none" />
  );

  return (
    <div
      className={clsx(
        baseClasses,
        variant ? variantClasses[variant] : "",
        !variant && bgColor,
        className
      )}
    >
      {variant === "highlight" && (
        <>
          {backgroundNoise}
          {renderHighlight()}
        </>
      )}

      {variant === "sectioned" ? (
        <>
          <div>
            {/* Título */}
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">

              <h2 className="text-[28px] font-semibold text-[#0A2A4D]">
                Últimas transações
              </h2>
              <div className="flex flex-col md:flex-row justify-between items-center">

                {exibirExtratoLink && (
                  <Link
                    href="/transactions"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Ver extrato completo →
                  </Link>
                )}

                {exibirBotaoVoltar && (
                  <Button variant="primary" onClick={() => router.push('/')}>Voltar para a Home</Button>
                )}
              </div>
            </div>

            {/* Subtitle - mobile */}
            {subtitle && (
              <div className="block sm:hidden">
                <a
                  href="#"
                  className="flex items-center gap-xxs text-sm text-brandPrimary font-inter"
                >
                  <span className="hover:underline">{subtitle}</span>
                  <span className="inline-flex w-4 h-4 items-center justify-center group-hover:no-underline">
                    <ArrowRightIcon
                      className="text-brandPrimary text-base"
                      bgColor="bg-transparent"
                    />
                  </span>
                </a>
              </div>
            )}

            {/* Subtitle - desktop */}
            {subtitle && (
              <div className="hidden sm:flex justify-between items-center">
                <div />
                <a
                  href="#"
                  className="flex items-center gap-xxs text-sm text-brandPrimary font-inter"
                >
                  <span className="hover:underline">{subtitle}</span>
                  <span className="inline-flex w-4 h-4 items-center justify-center group-hover:no-underline">
                    <ArrowRightIcon
                      className="text-brandPrimary text-base"
                      bgColor="bg-transparent"
                    />
                  </span>
                </a>
              </div>
            )}
          </div>

          <div className="bg-backgroundPrimary rounded-lg p-4 w-full overflow-x-hidden">

            <div className="hidden sm:grid grid-cols-[repeat(5,minmax(0,1fr))] gap-6 items-center text-sm font-semibold text-textPrimary mb-sm pr-md min-w-[560px] w-[120%] md:hidden lg:grid">
              <span>Transação</span>
              <span>Categoria</span>
              <span>Data</span>
              <span>Valor (R$)</span>
              <span>Ações</span>
            </div>
            {children}
          </div>
        </>
      ) : variant !== "highlight" ? (
        <>
          {title && <h2 className="text-h5 font-bold mb-4">{title}</h2>}
          {children}
        </>
      ) : null}
    </div>
  );
}
