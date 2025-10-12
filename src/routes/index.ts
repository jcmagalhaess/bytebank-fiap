import { Router } from "express";
import { transactionsRoutes } from "./transactions.routes.js";
import { usersRoutes } from "./users.routes.js";

const router = Router();

// Rota de Health Check
router.get("/", (req, res) => {
  return res.status(200).json({ status: "ok" });
});

router.use("/users", usersRoutes);
router.use("/transactions", transactionsRoutes);

export { router };
