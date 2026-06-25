import { Request, Response, NextFunction } from "express";
export declare class ProductController {
    /**
     * Handle create product request
     */
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Handle list products request (with search, pagination, and filter)
     */
    list(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Handle get product by ID request
     */
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Handle update product request
     */
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Handle delete product request
     */
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=product.controller.d.ts.map