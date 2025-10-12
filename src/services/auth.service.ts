import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";

type LoginDTO = {
  email: string;
  senha: string;
};

export class AuthService {
  async login({ email, senha }: LoginDTO) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    const passwordMatch = await compare(senha, user.senha);

    if (!passwordMatch) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    if (!process.env.JWT_SECRET) {
      throw new AppError("Chave secreta JWT não configurada no servidor.", 500);
    }

    const token = jwt.sign({}, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: "1d", // Token expira em 1 dia
    });

    return { token };
  }
}
