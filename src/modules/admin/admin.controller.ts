import { Request, Response, NextFunction } from "express";
import { AdminService } from "./admin.service";
import { sendSuccess } from "../../shared/response";

const adminService = new AdminService();

export class AdminController {
  async resetData(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adminService.resetData();
      sendSuccess({ res, message: result.message });
    } catch (error) {
      next(error);
    }
  }
}
