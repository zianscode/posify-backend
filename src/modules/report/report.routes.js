"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = require("./report.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const report_validation_1 = require("./report.validation");
const router = (0, express_1.Router)();
const reportController = new report_controller_1.ReportController();
router.use(auth_middleware_1.authMiddleware);
router.use((0, role_middleware_1.roleMiddleware)(["admin", "manager"]));
router.get("/sales", (0, validate_middleware_1.validate)(report_validation_1.salesReportQuerySchema), (req, res, next) => {
    reportController.salesReport(req, res, next);
});
router.get("/products", (0, validate_middleware_1.validate)(report_validation_1.productReportQuerySchema), (req, res, next) => {
    reportController.productReport(req, res, next);
});
router.get("/stock", (0, validate_middleware_1.validate)(report_validation_1.stockReportQuerySchema), (req, res, next) => {
    reportController.stockReport(req, res, next);
});
exports.default = router;
//# sourceMappingURL=report.routes.js.map