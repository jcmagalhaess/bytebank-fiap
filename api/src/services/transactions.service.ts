import type { Prisma, Transaction } from "@prisma/client";
import type {
  ListTransactionsQuery,
  UpdateTransactionDTO,
} from "../dtos/transaction.dto.js";
import { AppError } from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";

export type CreateTransactionDTO = {
  tipoTransacao: "credit" | "debit";
  valor: number;
  descricao: string;
  categoria: string;
  userId: string;
  filePath?: string;
};

export class TransactionsService {
  async create({
    tipoTransacao,
    valor,
    descricao,
    categoria,
    userId,
    filePath,
  }: CreateTransactionDTO): Promise<Transaction> {
    const transaction = await prisma.transaction.create({
      data: {
        tipoTransacao,
        valor,
        descricao,
        categoria,
        userId,
        filePath: filePath ?? null, // Converte undefined para null
      },
    });
    return transaction;
  }

  async findByUserId(userId: string, query: ListTransactionsQuery) {
    const {
      page,
      pageSize,
      tipo,
      categoria,
      dataInicio,
      dataFim,
      valorMin,
      descricao,
      valorMax,
    } = query;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where: Prisma.TransactionWhereInput = { userId };

    if (tipo) where.tipoTransacao = tipo;
    if (categoria)
      where.categoria = { contains: categoria, mode: "insensitive" };
    if (descricao)
      where.descricao = { contains: descricao, mode: "insensitive" };
    if (valorMin !== undefined)
      where.valor = { ...(where.valor as object), gte: valorMin };
    if (valorMax !== undefined)
      where.valor = { ...(where.valor as object), lte: valorMax };
    if (dataInicio)
      where.createdAt = { ...(where.createdAt as object), gte: dataInicio };
    if (dataFim)
      where.createdAt = { ...(where.createdAt as object), lte: dataFim };

    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.transaction.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      data: transactions,
      meta: {
        total,
        page,
        pageSize,
        totalPages,
      },
    };
  }

  async findById(id: string, userId: string): Promise<Transaction | null> {
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });
    return transaction;
  }

  async getSummaryByUserId(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const creditSummary = await prisma.transaction.aggregate({
      _sum: {
        valor: true,
      },
      where: {
        userId,
        tipoTransacao: "credit",
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    const debitSummary = await prisma.transaction.aggregate({
      _sum: {
        valor: true,
      },
      where: {
        userId,
        tipoTransacao: "debit",
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    const credit = creditSummary._sum?.valor ?? 0;
    const debit = debitSummary._sum?.valor ?? 0;

    return {
      credit,
      debit: debit * -1, // Retornando o valor de débito como negativo
      total: credit - debit, // Calculando o total
    };
  }

  async getYearlySummaryByUserId(userId: string) {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
    });

    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    const monthlySummary = Array.from({ length: 12 }, (_, i) => ({
      month: monthNames[i],
      credit: 0,
      debit: 0,
    }));

    for (const transaction of transactions) {
      const monthIndex = transaction.createdAt.getMonth(); // 0 (Janeiro) a 11 (Dezembro)
      if (transaction.tipoTransacao === "credit") {
        monthlySummary[monthIndex]!.credit += transaction.valor;
      } else {
        monthlySummary[monthIndex]!.debit -= transaction.valor;
      }
    }

    return monthlySummary;
  }

  async update(
    id: string,
    userId: string,
    data: UpdateTransactionDTO
  ): Promise<Transaction> {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new AppError("Transação não encontrada.", 404);
    }

    if (transaction.userId !== userId) {
      throw new AppError("Transação não encontrada.", 404);
    }

    const prismaUpdateData: Prisma.TransactionUpdateInput = {};

    // Adiciona campos ao objeto de atualização apenas se eles não forem undefined
    Object.keys(data).forEach((key) => {
      if (data[key as keyof typeof data] !== undefined) {
        (prismaUpdateData as any)[key] = data[key as keyof typeof data];
      }
    });

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: prismaUpdateData,
    });

    return updatedTransaction;
  }

  async delete(id: string, userId: string): Promise<void> {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new AppError("Transação não encontrada.", 404);
    }

    if (transaction.userId !== userId) {
      throw new AppError("Transação não encontrada.", 404);
    }

    await prisma.transaction.delete({ where: { id } });
  }
}
