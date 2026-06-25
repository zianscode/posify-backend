"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = require("./transaction.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const transaction_validation_1 = require("./transaction.validation");
const router = (0, express_1.Router)();
const transactionController = new transaction_controller_1.TransactionController();
// POST create transaction: Protected (admin, manager, kasir)
router.post("/", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(transaction_validation_1.createTransactionSchema), (req, res, next) => {
    transactionController.create(req, res, next);
});
// GET all transactions (history): Protected (admin, manager, kasir)
router.get("/", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(transaction_validation_1.getTransactionsQuerySchema), (req, res, next) => {
    transactionController.list(req, res, next);
});
// GET transaction by ID: Protected (admin, manager, kasir)
router.get("/:id", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(transaction_validation_1.getTransactionByIdSchema), (req, res, next) => {
    transactionController.getById(req, res, next);
});
exports.default = router;
//# sourceMappingURL=transaction.routes.js.map