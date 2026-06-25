import { Request, Response, NextFunction } from "express";
export declare class DashboardController {
    /**
     * Handle summary statistics request
     */
    getSummary(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Handle sales trend request
     */
    getSalesTrend(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Handle top-selling products request
     */
    getTopProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=dashboard.controller.d.ts.map