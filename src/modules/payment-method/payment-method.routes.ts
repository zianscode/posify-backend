import { Router } from "express";
import { PaymentMethodController } from "./payment-method.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();
const paymentMethodController = new PaymentMethodController();

// GET all payment methods: Protected (admin, manager, kasir)
router.get("/", authMiddleware, (req, res, next) => {
  paymentMethodController.list(req, res, next);
});

export default router;
