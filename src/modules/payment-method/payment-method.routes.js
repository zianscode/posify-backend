"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_method_controller_1 = require("./payment-method.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const paymentMethodController = new payment_method_controller_1.PaymentMethodController();
// GET all payment methods: Protected (admin, manager, kasir)
router.get("/", auth_middleware_1.authMiddleware, (req, res, next) => {
    paymentMethodController.list(req, res, next);
});
exports.default = router;
//# sourceMappingURL=payment-method.routes.js.map