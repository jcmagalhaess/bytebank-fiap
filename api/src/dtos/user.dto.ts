import { z } from "zod";

export const createUserSchema = z.object({
  nome: z.string().min(3, "O nome precisa ter no mínimo 3 caracteres."),
  email: z.string().email("Formato de e-mail inválido."),
  senha: z.string().min(6, "A senha precisa ter no mínimo 6 caracteres."),
});

export const loginUserSchema = z.object({
  email: z.string().email("Formato de e-mail inválido."),
  senha: z.string().min(6, "A senha precisa ter no mínimo 6 caracteres."),
});
