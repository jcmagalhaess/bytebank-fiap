import type { Metadata } from "next";
import { Header } from "../components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "ByteBank",
  description: "Aplicação de controle financeiro para gerenciar suas transações",
  icons: {
    icon: "/favicon_bb.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-[#E6F0FA]">
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
        <Header userName="Joana da Silva Oliveira" />
        <div className="flex">
          <main className="p-6 w-full md:w-[70%] mx-auto justify-items-center">
            <div className="w-full justify-items-center">
            {children}
            </div>
            </main>
        </div>
      </body>
    </html>
  );
}
