import { prisma } from "../../config/database";

export class PaymentMethodService {
  /**
   * Get all payment methods
   */
  async getPaymentMethods() {
    return prisma.paymentMethod.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }
}
