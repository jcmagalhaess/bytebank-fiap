import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";
import type { Request, Response } from "express";
import {
  createTransactionSchema,
  listTransactionsQuerySchema,
  updateTransactionSchema,
} from "../dtos/transaction.dto.js";
import { AppError } from "../errors/AppError.js";
import {
  type CreateTransactionDTO,
  TransactionsService,
} from "../services/transactions.service.js";

const transactionsService = new TransactionsService();

const s3Client = new S3Client({
  region: process.env.AWS_REGION ?? "us-east-1",
});

export class TransactionsController {
  async create(req: Request, res: Response) {
    // O corpo da requisição vem como string por causa do multipart/form-data
    const { valor, ...rest } = req.body;
    const parsedBody = {
      ...rest,
      valor: parseFloat(valor),
    };

    const transactionData = createTransactionSchema.parse(parsedBody);
    const userId = req.user.id;
    let filePath: string | undefined = undefined;

    if (req.file) {
      const file = req.file;
      const fileKey = `${randomBytes(16).toString("hex")}-${file.originalname}`;

      const putCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3Client.send(putCommand);

      filePath = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
    }

    const createData: CreateTransactionDTO = {
      ...transactionData,
      userId,
    };

    if (filePath) {
      createData.filePath = filePath;
    }

    const transaction = await transactionsService.create(createData);
    return res.status(201).json(transaction);
  }

  async list(req: Request, res: Response) {
    const userId = req.user.id;
    const query = listTransactionsQuerySchema.parse(req.query);
    const transactions = await transactionsService.findByUserId(userId, query);
    return res.json(transactions);
  }

  async summary(req: Request, res: Response) {
    const userId = req.user.id;
    const summary = await transactionsService.getSummaryByUserId(userId);
    return res.json(summary);
  }

  async yearlySummary(req: Request, res: Response) {
    const userId = req.user.id;
    const summary = await transactionsService.getYearlySummaryByUserId(userId);
    return res.json(summary);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user.id;

    const { valor, ...rest } = req.body;
    const parsedBody = {
      ...rest,
      ...(valor !== undefined && { valor: parseFloat(valor) }),
    };

    if (Object.keys(parsedBody).length === 0 && !req.file) {
      throw new AppError("Nenhum dado fornecido para atualização.", 400);
    }

    const transactionData = updateTransactionSchema.parse(parsedBody);
    let filePath: string | undefined = undefined;

    if (req.file) {
      const file = req.file;
      const fileKey = `${randomBytes(16).toString("hex")}-${file.originalname}`;

      const putCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3Client.send(putCommand);

      filePath = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
    }

    const updatedTransaction = await transactionsService.update(id!, userId, {
      ...transactionData,
      ...(filePath && { filePath }),
    });

    return res.json(updatedTransaction);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user.id;

    await transactionsService.delete(id!, userId);
    return res.status(204).send();
  }
}
