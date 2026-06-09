import { Request, Response, NextFunction } from "express";
import { DashboardService } from "./dashboard.service";
import { sendSuccess } from "../../shared/response";

const dashboardService = new DashboardService();

export class DashboardController {
  /**
   * Handle summary statistics request
   */
  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query as any;
      const outletId = req.user?.outletId ?? undefined;
      const result = await dashboardService.getSummary(startDate, endDate, outletId);

      sendSuccess({
        res,
        message: "Ringkasan statistik dashboard berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle sales trend request
   */
  async getSalesTrend(req: Request, res: Response, next: NextFunction) {
    try {
      const { days, startDate, endDate } = req.query as any;
      const outletId = req.user?.outletId ?? undefined;
      const result = await dashboardService.getSalesTrend(days, startDate, endDate, outletId);

      sendSuccess({
        res,
        message: "Tren penjualan berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle top-selling products request
   */
  async getTopProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, startDate, endDate } = req.query as any;
      const outletId = req.user?.outletId ?? undefined;
      const result = await dashboardService.getTopProducts(limit, startDate, endDate, outletId);

      sendSuccess({
        res,
        message: "Produk terlaris berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
