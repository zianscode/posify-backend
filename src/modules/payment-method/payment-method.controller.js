"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodController = void 0;
const payment_method_service_1 = require("./payment-method.service");
const response_1 = require("../../shared/response");
const paymentMethodService = new payment_method_service_1.PaymentMethodService();
class PaymentMethodController {
    /**
     * Handle list payment methods request
     */
    async list(req, res, next) {
        try {
            const result = await paymentMethodService.getPaymentMethods();
            (0, response_1.sendSuccess)({
                res,
                message: "Daftar metode pembayaran berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PaymentMethodController = PaymentMethodController;
//# sourceMappingURL=payment-method.controller.js.map