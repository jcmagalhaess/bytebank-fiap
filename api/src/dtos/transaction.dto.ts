import type { Prisma } from "@prisma/client";
import { z } from "zod";

export const createTransactionSchema = z.object({
  tipoTransacao: z.enum(["credit", "debit"]),
  valor: z.number().positive("O valor deve ser um número positivo."),
  descricao: z.string().min(1, "A descrição é obrigatória."),
  categoria: z.string().min(1, "A categoria é obrigatória."),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const listTransactionsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  tipo: z.enum(["credit", "debit"]).optional(),
  categoria: z.string().optional(),
  descricao: z.string().optional(),
  dataInicio: z.coerce.date().optional(),
  dataFim: z.coerce.date().optional(),
  valorMin: z.coerce.number().min(0).optional(),
  valorMax: z.coerce.number().min(0).optional(),
});

export type UpdateTransactionDTO = z.infer<typeof updateTransactionSchema> &
  Pick<Prisma.TransactionUpdateInput, "filePath">;

export type ListTransactionsQuery = z.infer<typeof listTransactionsQuerySchema>;
