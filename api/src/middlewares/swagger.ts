import path from "path";
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bytebank API",
      version: "1.0.0",
      description:
        "API para gerenciamento financeiro pessoal, com CRUD de usuários e transações.",
      contact: {
        name: "Júlio Magalhães",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Transaction: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            tipoTransacao: { type: "string", enum: ["credit", "debit"] },
            valor: { type: "number", format: "float" },
            descricao: { type: "string" },
            categoria: { type: "string" },
            filePath: {
              type: "string",
              nullable: true,
              description: "Caminho para o arquivo de comprovante",
            },
            createdAt: { type: "string", format: "date-time" },
            userId: {
              type: "string",
              format: "uuid",
              description: "ID do usuário proprietário da transação",
            },
          },
        },
      },
    },
  },
  // Caminho para os arquivos que contêm as anotações da API
  apis: [
    path.resolve(process.cwd(), "src/routes/users.routes.ts"),
    path.resolve(process.cwd(), "src/routes/transactions.routes.ts"),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
