import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mt-4 flex flex-col items-center justify-center text-[#0A2A4D] px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-center mb-8">
        Desculpe, a página que você está procurando não existe.
      </p>
      <Link
        href="/"
        className="px-6 py-3"
      >
        <Button variant="primary">
          Voltar para Home
        </Button>
      </Link>

    </div>
  );
}
