import { Request, Response, NextFunction } from "express";
import { PaymentMethodService } from "./payment-method.service";
import { sendSuccess } from "../../shared/response";

const paymentMethodService = new PaymentMethodService();

export class PaymentMethodController {
  /**
   * Handle list payment methods request
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await paymentMethodService.getPaymentMethods();

      sendSuccess({
        res,
        message: "Daftar metode pembayaran berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
