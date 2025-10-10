import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";

interface TokenPayload {
  sub: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token de autenticação não fornecido.", 401);
  }

  const [, token] = authHeader.split(" ");

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    // Este é um erro de configuração do servidor, não do cliente.
    throw new AppError("Chave secreta JWT não configurada no servidor.", 500);
  }

  try {
    const { sub: userId } = jwt.verify(token!, jwtSecret) as TokenPayload;

    // Adiciona o ID do usuário ao objeto de requisição para uso posterior
    req.user = {
      id: userId,
    };

    return next();
  } catch {
    throw new AppError("Token inválido.", 401);
  }
}

// Adicionar a propriedade 'user' ao tipo Request do Express
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      user: {
        id: string;
      };
    }
  }
}
