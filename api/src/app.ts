import "dotenv/config";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import cors from "cors";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";
import { ZodError } from "zod";
import { AppError } from "./errors/AppError.js";
import { swaggerSpec } from "./middlewares/swagger.js";
import { router } from "./routes/index.js";

const app = express();

// Habilita o CORS para todas as origens.
// Para produção, é recomendado restringir as origens permitidas.
app.use(cors());
app.use(express.json());

// Rota da documentação
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/files", express.static("uploads")); // Rota para servir arquivos estáticos
app.use(router);

// Middleware de tratamento de erros
app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    if (err instanceof ZodError) {
      return response.status(400).json({
        message: "Erro de validação.",
        issues: err.format(),
      });
    }

    console.error(err);

    return response.status(500).json({
      status: "error",
      message: "Erro interno do servidor.",
    });
  }
);

export { app };
