import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  getSummaryQuerySchema,
  getSalesTrendQuerySchema,
  getTopProductsQuerySchema,
} from "./dashboard.validation";

const router = Router();
const dashboardController = new DashboardController();

// Protect all routes under this router: Only admin can access
router.use(authMiddleware);
router.use(roleMiddleware(["admin"]));

// GET /summary
router.get("/summary", validate(getSummaryQuerySchema), (req, res, next) => {
  dashboardController.getSummary(req, res, next);
});

// GET /sales-trend
router.get("/sales-trend", validate(getSalesTrendQuerySchema), (req, res, next) => {
  dashboardController.getSalesTrend(req, res, next);
});

// GET /top-products
router.get("/top-products", validate(getTopProductsQuerySchema), (req, res, next) => {
  dashboardController.getTopProducts(req, res, next);
});

export default router;
