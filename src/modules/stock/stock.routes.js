"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stock_controller_1 = require("./stock.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const stock_validation_1 = require("./stock.validation");
const router = (0, express_1.Router)();
const stockController = new stock_controller_1.StockController();
// POST adjust stock: Protected (admin only)
router.post("/adjust", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["admin"]), (0, validate_middleware_1.validate)(stock_validation_1.adjustStockSchema), (req, res, next) => {
    stockController.adjust(req, res, next);
});
// GET stock movements history: Protected (all roles)
router.get("/movements/:productId", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(stock_validation_1.getMovementsSchema), (req, res, next) => {
    stockController.listMovements(req, res, next);
});
exports.default = router;
//# sourceMappingURL=stock.routes.js.map