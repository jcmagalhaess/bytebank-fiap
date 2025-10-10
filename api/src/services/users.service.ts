import type { User } from "@prisma/client";
import { hash } from "bcryptjs";
import { AppError } from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";

// DTO para criação
type CreateUserDTO = {
  nome: string;
  email: string;
  senha: string;
};

export class UsersService {
  async create({
    nome,
    email,
    senha,
  }: CreateUserDTO): Promise<Omit<User, "senha">> {
    const userAlreadyExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userAlreadyExists) {
      throw new AppError("Este e-mail já está em uso.", 409);
    }

    const passwordHash = await hash(senha, 8);

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha: passwordHash,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findById(id: string): Promise<Omit<User, "senha"> | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
