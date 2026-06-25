import { Request, Response, NextFunction } from "express";
export declare class TransactionController {
    /**
     * Handle create transaction request
     */
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Handle list transactions history request (with filters & pagination)
     */
    list(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Handle get transaction by ID request
     */
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=transaction.controller.d.ts.map