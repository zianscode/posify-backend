"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const transaction_service_1 = require("./transaction.service");
const response_1 = require("../../shared/response");
const transactionService = new transaction_service_1.TransactionService();
class TransactionController {
    /**
     * Handle create transaction request
     */
    async create(req, res, next) {
        try {
            const { userId, outletId } = req.user;
            const result = await transactionService.createTransaction(userId, outletId, req.body);
            (0, response_1.sendSuccess)({
                res,
                statusCode: 201,
                message: "Transaksi berhasil dibuat",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Handle list transactions history request (with filters & pagination)
     */
    async list(req, res, next) {
        try {
            const { page, limit, startDate, endDate, userId, paymentMethodId, search } = req.query;
            const { transactions, meta } = await transactionService.getTransactions({
                page,
                limit,
                startDate,
                endDate,
                userId,
                paymentMethodId,
                search,
            });
            (0, response_1.sendSuccess)({
                res,
                message: "Daftar transaksi berhasil diambil",
                data: transactions,
                meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Handle get transaction by ID request
     */
    async getById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const result = await transactionService.getTransactionById(id);
            (0, response_1.sendSuccess)({
                res,
                message: "Detail transaksi berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TransactionController = TransactionController;
//# sourceMappingURL=transaction.controller.js.map