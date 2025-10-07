import { Router } from "express";
import multer from "multer";
import { TransactionsController } from "../controllers/transactions.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

// Configuração do Multer para upload de arquivos
const upload = multer({
  storage: multer.memoryStorage(),
});

const transactionsRoutes = Router();
const transactionsController = new TransactionsController();

// Todas as rotas de transação exigem autenticação
transactionsRoutes.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Gerenciamento de transações financeiras
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Lista todas as transações do usuário autenticado
 *     description: Retorna uma lista paginada de transações, com suporte a filtros.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [credit, debit]
 *         description: Filtra por tipo de transação.
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtra por categoria (busca parcial, case-insensitive).
 *       - in: query
 *         name: descricao
 *         schema:
 *           type: string
 *         description: Filtra por descrição (busca parcial, case-insensitive).
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início do filtro (formato YYYY-MM-DD).
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim do filtro (formato YYYY-MM-DD).
 *       - in: query
 *         name: valorMin
 *         schema:
 *           type: number
 *         description: Filtra por valor mínimo da transação.
 *       - in: query
 *         name: valorMax
 *         schema:
 *           type: number
 *         description: Filtra por valor máximo da transação.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página para a paginação.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Quantidade de itens por página.
 *     responses:
 *       200:
 *         description: Lista paginada de transações retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Número total de itens.
 *                     page:
 *                       type: integer
 *                       description: Página atual.
 *                     pageSize:
 *                       type: integer
 *                       description: Itens por página.
 *                     totalPages:
 *                       type: integer
 *                       description: Número total de páginas.
 *       401:
 *         description: Não autorizado. Token inválido ou não fornecido.
 */
transactionsRoutes.get("/", transactionsController.list);

/**
 * @swagger
 * /transactions/summary:
 *   get:
 *     summary: Retorna os totalizadores de crédito e débito do mês corrente
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Totalizadores retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 credit:
 *                   type: number
 *                   description: Soma de todos os créditos no mês.
 *                   example: 2500.50
 *                 debit:
 *                   type: number
 *                   description: Soma de todos os débitos no mês (valor negativo).
 *                   example: -850.75
 *                 total:
 *                   type: number
 *                   description: Saldo total do mês (créditos - débitos).
 *                   example: 1649.75
 *       401:
 *         description: Não autorizado. Token inválido ou não fornecido.
 */
transactionsRoutes.get("/summary", transactionsController.summary);

/**
 * @swagger
 * /transactions/yearly-summary:
 *   get:
 *     summary: Retorna um resumo de créditos e débitos para cada mês do ano corrente
 *     description: Ideal para popular um gráfico de barras ou linhas mostrando a atividade financeira ao longo do ano.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumo anual retornado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                     description: O nome do mês.
 *                     example: "Janeiro"
 *                   credit:
 *                     type: number
 *                     description: Soma total de créditos para o mês.
 *                     example: 5000
 *                   debit:
 *                     type: number
 *                     description: Soma total de débitos para o mês (valor negativo).
 *                     example: -1250.55
 *       401:
 *         description: Não autorizado. Token inválido ou não fornecido.
 */
transactionsRoutes.get("/yearly-summary", transactionsController.yearlySummary);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Cria uma nova transação
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - tipoTransacao
 *               - valor
 *               - descricao
 *               - categoria
 *             properties:
 *               tipoTransacao:
 *                 type: string
 *                 enum: [credit, debit]
 *               valor:
 *                 type: number
 *                 description: O valor da transação (enviado como string).
 *               descricao:
 *                 type: string
 *               categoria:
 *                 type: string
 *               comprovante:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Transação criada com sucesso.
 *       400:
 *         description: Erro de validação nos dados de entrada.
 *       401:
 *         description: Não autorizado.
 */
transactionsRoutes.post(
  "/",
  upload.single("comprovante"), // 'comprovante' é o nome do campo no form-data
  transactionsController.create
);

/**
 * @swagger
 * /transactions/{id}:
 *   patch:
 *     summary: Atualiza uma transação existente
 *     description: Atualiza parcialmente os dados de uma transação específica do usuário autenticado.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: O ID da transação a ser atualizada.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               tipoTransacao:
 *                 type: string
 *                 enum: [credit, debit]
 *               valor:
 *                 type: number
 *                 description: O valor da transação (enviado como string).
 *               descricao:
 *                 type: string
 *               categoria:
 *                 type: string
 *               comprovante:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Erro de validação nos dados de entrada.
 *       401:
 *         description: Não autorizado.
 *       404:
 *         description: Transação não encontrada.
 */
transactionsRoutes.patch(
  "/:id",
  upload.single("comprovante"),
  transactionsController.update
);

/**
 * @swagger
 * /transactions/{id}/receipt:
 *   get:
 *     summary: Obtém os detalhes e a URL de preview do comprovante
 *     description: Retorna uma URL temporária e segura para visualizar o comprovante, junto com seu nome e tamanho.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: O ID da transação.
 *     responses:
 *       200:
 *         description: Detalhes do comprovante retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL assinada para preview.
 *                 name:
 *                   type: string
 *                   description: Nome original do arquivo.
 *                 size:
 *                   type: integer
 *                   description: Tamanho do arquivo em bytes.
 *       404:
 *         description: Transação ou comprovante não encontrado.
 */
transactionsRoutes.get(
  "/:id/receipt",
  transactionsController.getReceiptDetails
);

/**
 * @swagger
 * /transactions/{id}/receipt/download:
 *   get:
 *     summary: Faz o download do comprovante
 *     description: Gera uma URL assinada e redireciona o usuário para forçar o download do arquivo.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: O ID da transação.
 */
transactionsRoutes.get(
  "/:id/receipt/download",
  transactionsController.downloadReceipt
);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Deleta uma transação
 *     description: Remove uma transação específica do usuário autenticado.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: O ID da transação a ser deletada.
 *     responses:
 *       204:
 *         description: Transação deletada com sucesso.
 *       401:
 *         description: Não autorizado.
 *       404:
 *         description: Transação não encontrada.
 */
transactionsRoutes.delete("/:id", transactionsController.delete);

export { transactionsRoutes };
