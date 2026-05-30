import { Request, Response, NextFunction } from "express";
import { StockService } from "./stock.service";
import { sendSuccess } from "../../shared/response";

const stockService = new StockService();

export class StockController {
  /**
   * Handle stock adjustment request
   */
  async adjust(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await stockService.adjustStock(userId, req.body);

      sendSuccess({
        res,
        message: "Stok berhasil disesuaikan",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle stock movements history request
   */
  async listMovements(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = Number(req.params.productId);
      const result = await stockService.getStockMovements(productId);

      sendSuccess({
        res,
        message: "Riwayat pergerakan stok berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
