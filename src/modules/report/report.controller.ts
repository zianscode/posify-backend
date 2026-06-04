import { Request, Response, NextFunction } from "express";
import { ReportService } from "./report.service";
import { sendSuccess } from "../../shared/response";

const reportService = new ReportService();

export class ReportController {
  async salesReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate, format } = req.query as any;

      if (format === "csv") {
        const { summary, transactions } = await reportService.getSalesReport(startDate, endDate);
        const csv = reportService.getSalesCSV(summary, transactions);
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="laporan-penjualan.csv"`);
        return res.send(csv);
      }

      const data = await reportService.getSalesReport(startDate, endDate);
      sendSuccess({
        res,
        message: "Laporan penjualan berhasil diambil",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async productReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate, limit, format } = req.query as any;

      if (format === "csv") {
        const products = await reportService.getProductReport(limit, startDate, endDate);
        const csv = reportService.getProductCSV(products);
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="laporan-produk.csv"`);
        return res.send(csv);
      }

      const data = await reportService.getProductReport(limit, startDate, endDate);
      sendSuccess({
        res,
        message: "Laporan produk berhasil diambil",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async stockReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { format } = req.query as any;

      if (format === "csv") {
        const data = await reportService.getStockReport();
        const csv = reportService.getStockCSV(data.summary, data.products);
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="laporan-stok.csv"`);
        return res.send(csv);
      }

      const data = await reportService.getStockReport();
      sendSuccess({
        res,
        message: "Laporan stok berhasil diambil",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
