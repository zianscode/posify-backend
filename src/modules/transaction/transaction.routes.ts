import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  createTransactionSchema,
  getTransactionByIdSchema,
  getTransactionsQuerySchema,
} from "./transaction.validation";

const router = Router();
const transactionController = new TransactionController();

// POST create transaction: Protected (admin, manager, kasir)
router.post("/", authMiddleware, validate(createTransactionSchema), (req, res, next) => {
  transactionController.create(req, res, next);
});

// GET all transactions (history): Protected (admin, manager, kasir)
router.get("/", authMiddleware, validate(getTransactionsQuerySchema), (req, res, next) => {
  transactionController.list(req, res, next);
});

// GET transaction by ID: Protected (admin, manager, kasir)
router.get("/:id", authMiddleware, validate(getTransactionByIdSchema), (req, res, next) => {
  transactionController.getById(req, res, next);
});

export default router;
