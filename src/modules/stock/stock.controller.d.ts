import { Request, Response, NextFunction } from "express";
export declare class StockController {
    /**
     * Handle stock adjustment request
     */
    adjust(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Handle stock movements history request
     */
    listMovements(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=stock.controller.d.ts.map