"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const dashboard_validation_1 = require("./dashboard.validation");
const router = (0, express_1.Router)();
const dashboardController = new dashboard_controller_1.DashboardController();
// Protect all routes under this router: Only admin can access
router.use(auth_middleware_1.authMiddleware);
router.use((0, role_middleware_1.roleMiddleware)(["admin"]));
// GET /summary
router.get("/summary", (0, validate_middleware_1.validate)(dashboard_validation_1.getSummaryQuerySchema), (req, res, next) => {
    dashboardController.getSummary(req, res, next);
});
// GET /sales-trend
router.get("/sales-trend", (0, validate_middleware_1.validate)(dashboard_validation_1.getSalesTrendQuerySchema), (req, res, next) => {
    dashboardController.getSalesTrend(req, res, next);
});
// GET /top-products
router.get("/top-products", (0, validate_middleware_1.validate)(dashboard_validation_1.getTopProductsQuerySchema), (req, res, next) => {
    dashboardController.getTopProducts(req, res, next);
});
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map