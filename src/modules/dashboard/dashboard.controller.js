"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
const response_1 = require("../../shared/response");
const dashboardService = new dashboard_service_1.DashboardService();
class DashboardController {
    /**
     * Handle summary statistics request
     */
    async getSummary(req, res, next) {
        try {
            const { startDate, endDate } = req.query;
            const outletId = req.user?.outletId ?? undefined;
            const result = await dashboardService.getSummary(startDate, endDate, outletId);
            (0, response_1.sendSuccess)({
                res,
                message: "Ringkasan statistik dashboard berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Handle sales trend request
     */
    async getSalesTrend(req, res, next) {
        try {
            const { days, startDate, endDate } = req.query;
            const outletId = req.user?.outletId ?? undefined;
            const result = await dashboardService.getSalesTrend(days, startDate, endDate, outletId);
            (0, response_1.sendSuccess)({
                res,
                message: "Tren penjualan berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Handle top-selling products request
     */
    async getTopProducts(req, res, next) {
        try {
            const { limit, startDate, endDate } = req.query;
            const outletId = req.user?.outletId ?? undefined;
            const result = await dashboardService.getTopProducts(limit, startDate, endDate, outletId);
            (0, response_1.sendSuccess)({
                res,
                message: "Produk terlaris berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map