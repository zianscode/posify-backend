import { Router } from "express";
import { StockController } from "./stock.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { adjustStockSchema, getMovementsSchema } from "./stock.validation";

const router = Router();
const stockController = new StockController();

// POST adjust stock: Protected (admin, manager only)
router.post(
  "/adjust",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  validate(adjustStockSchema),
  (req, res, next) => {
    stockController.adjust(req, res, next);
  }
);

// GET stock movements history: Protected (all roles)
router.get(
  "/movements/:productId",
  authMiddleware,
  validate(getMovementsSchema),
  (req, res, next) => {
    stockController.listMovements(req, res, next);
  }
);

export default router;
