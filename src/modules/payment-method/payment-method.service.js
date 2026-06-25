"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodService = void 0;
const database_1 = require("../../config/database");
class PaymentMethodService {
    /**
     * Get all payment methods
     */
    async getPaymentMethods() {
        return database_1.prisma.paymentMethod.findMany({
            orderBy: {
                id: "asc",
            },
        });
    }
}
exports.PaymentMethodService = PaymentMethodService;
//# sourceMappingURL=payment-method.service.js.map