"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockController = void 0;
const stock_service_1 = require("./stock.service");
const response_1 = require("../../shared/response");
const stockService = new stock_service_1.StockService();
class StockController {
    /**
     * Handle stock adjustment request
     */
    async adjust(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await stockService.adjustStock(userId, req.body);
            (0, response_1.sendSuccess)({
                res,
                message: "Stok berhasil disesuaikan",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Handle stock movements history request
     */
    async listMovements(req, res, next) {
        try {
            const productId = Number(req.params.productId);
            const result = await stockService.getStockMovements(productId);
            (0, response_1.sendSuccess)({
                res,
                message: "Riwayat pergerakan stok berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.StockController = StockController;
//# sourceMappingURL=stock.controller.js.map