import { Router } from "express";
import { ReportController } from "./report.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  salesReportQuerySchema,
  productReportQuerySchema,
  stockReportQuerySchema,
} from "./report.validation";

const router = Router();
const reportController = new ReportController();

router.use(authMiddleware);
router.use(roleMiddleware(["admin", "manager"]));

router.get("/sales", validate(salesReportQuerySchema), (req, res, next) => {
  reportController.salesReport(req, res, next);
});

router.get("/products", validate(productReportQuerySchema), (req, res, next) => {
  reportController.productReport(req, res, next);
});

router.get("/stock", validate(stockReportQuerySchema), (req, res, next) => {
  reportController.stockReport(req, res, next);
});

export default router;
