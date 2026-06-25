"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const report_service_1 = require("./report.service");
const response_1 = require("../../shared/response");
const reportService = new report_service_1.ReportService();
class ReportController {
    async salesReport(req, res, next) {
        try {
            const { startDate, endDate, format } = req.query;
            if (format === "csv") {
                const { summary, transactions } = await reportService.getSalesReport(startDate, endDate);
                const csv = reportService.getSalesCSV(summary, transactions);
                res.setHeader("Content-Type", "text/csv; charset=utf-8");
                res.setHeader("Content-Disposition", `attachment; filename="laporan-penjualan.csv"`);
                return res.send(csv);
            }
            const data = await reportService.getSalesReport(startDate, endDate);
            (0, response_1.sendSuccess)({
                res,
                message: "Laporan penjualan berhasil diambil",
                data,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async productReport(req, res, next) {
        try {
            const { startDate, endDate, limit, format } = req.query;
            if (format === "csv") {
                const products = await reportService.getProductReport(limit, startDate, endDate);
                const csv = reportService.getProductCSV(products);
                res.setHeader("Content-Type", "text/csv; charset=utf-8");
                res.setHeader("Content-Disposition", `attachment; filename="laporan-produk.csv"`);
                return res.send(csv);
            }
            const data = await reportService.getProductReport(limit, startDate, endDate);
            (0, response_1.sendSuccess)({
                res,
                message: "Laporan produk berhasil diambil",
                data,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async stockReport(req, res, next) {
        try {
            const { format } = req.query;
            if (format === "csv") {
                const data = await reportService.getStockReport();
                const csv = reportService.getStockCSV(data.summary, data.products);
                res.setHeader("Content-Type", "text/csv; charset=utf-8");
                res.setHeader("Content-Disposition", `attachment; filename="laporan-stok.csv"`);
                return res.send(csv);
            }
            const data = await reportService.getStockReport();
            (0, response_1.sendSuccess)({
                res,
                message: "Laporan stok berhasil diambil",
                data,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ReportController = ReportController;
//# sourceMappingURL=report.controller.js.map