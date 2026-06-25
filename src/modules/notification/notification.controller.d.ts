import { Request, Response, NextFunction } from "express";
export declare class NotificationController {
    findAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    markAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
    markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUnreadCount(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteAll(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=notification.controller.d.ts.map