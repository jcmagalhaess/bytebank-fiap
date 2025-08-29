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
      "w-full rounded-[16px] text-white flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0 sm:p-10 p-6",
      "bg-gradient-to-r from-brandSecondary to-brandPrimary",
      "relative overflow-hidden"
    ),
sectioned: clsx(
  "bg-white/60 shadow-md rounded-xl p-4 sm:p-6 w-full",
  "flex flex-col gap-md"
),

    form: clsx("bg-backgroundPrimary rounded-xl p-4 sm:p-6 shadow-md"),
  };

  const renderHighlight = () => (
    <div className="flex flex-col gap-sm z-10 max-w-full sm:max-w-[600px]">
      <h1 className="text-xl sm:text-h1 font-bold text-backgroundPrimary font-jakarta">
        {title}
      </h1>
      {pathname === "/" && (
        <p className="text-base sm:text-h4 text-backgroundPrimary font-jakarta -mt-2">
          Bem-vindo(a) de volta
        </p>
      )}
      <p className="text-sm sm:text-md text-backgroundPrimary mt-sm font-jakarta">
        Este é o resumo da sua vida financeira.
      </p>

      {/* Versão mobile: valor em uma linha separada */}
      <div className="block sm:hidden mt-2">
        <p className="text-sm text-backgroundPrimary font-jakarta">
          Seu saldo atual é
        </p>
        <p className={`text-[28px] font-bold font-jakarta ${Number(subtitle?.replace(/[^\d\-\.]/g, "")) < 0 ? "text-feedbackDanger" : "text-feedbackSuccess"}`}>
          {subtitle}
        </p>
      </div>

      {/* Versão desktop: valor na mesma linha */}
      <p className="hidden sm:block text-sm text-backgroundPrimary font-jakarta">
        Seu saldo atual é{" "}
        <span className={`font-bold text-[36px] font-jakarta ${Number(subtitle?.replace(/[^\d\-\.]/g, "")) < 0 ? "text-feedbackDanger" : "text-feedbackSuccess"}`}>
          {subtitle}
        </span>
      </p>
    </div>
  );

  const backgroundNoise = (
    <div className="absolute inset-0 z-0 opacity-50 bg-[url('/Noise.png')] bg-cover bg-center pointer-events-none" />
  );

  const highlightImage = (
    <img
      src="/undraw_finance_m6vw 1.png"
      alt="Gráfico decorativo"
      className="hidden sm:block absolute right-10 bottom-0 h-full z-10"
    />
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
          {highlightImage}
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

            <div className="hidden sm:grid grid-cols-[repeat(4,minmax(0,1fr))] gap-6 items-center text-sm font-semibold text-textPrimary mb-sm pr-sm min-w-[560px] w-[120%]">
              <span>Transação</span>
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
