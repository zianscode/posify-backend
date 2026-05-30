import { Request, Response, NextFunction } from "express";
import { TransactionService } from "./transaction.service";
import { sendSuccess } from "../../shared/response";

const transactionService = new TransactionService();

export class TransactionController {
  /**
   * Handle create transaction request
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, outletId } = req.user!;
      const result = await transactionService.createTransaction(userId, outletId, req.body);

      sendSuccess({
        res,
        statusCode: 201,
        message: "Transaksi berhasil dibuat",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle list transactions history request (with filters & pagination)
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, startDate, endDate, userId, paymentMethodId } = req.query as any;

      const { transactions, meta } = await transactionService.getTransactions({
        page,
        limit,
        startDate,
        endDate,
        userId,
        paymentMethodId,
      });

      sendSuccess({
        res,
        message: "Daftar transaksi berhasil diambil",
        data: transactions,
        meta,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle get transaction by ID request
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await transactionService.getTransactionById(id);

      sendSuccess({
        res,
        message: "Detail transaksi berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
