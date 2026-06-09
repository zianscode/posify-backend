import { Request, Response, NextFunction } from "express";
import { NotificationService } from "./notification.service";
import { sendSuccess } from "../../shared/response";
import { BadRequestError } from "../../shared/errors";

const notificationService = new NotificationService();

export class NotificationController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const outletId = req.user!.outletId;
      const result = await notificationService.findAll(userId, outletId);

      sendSuccess({
        res,
        message: "Daftar notifikasi berhasil diambil",
        data: result.notifications,
        meta: { unreadCount: result.unreadCount },
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) throw new BadRequestError("ID notifikasi tidak valid");
      await notificationService.markAsRead(id, userId);

      sendSuccess({
        res,
        message: "Notifikasi telah dibaca",
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const outletId = req.user!.outletId;
      const result = await notificationService.markAllAsRead(userId, outletId);

      sendSuccess({
        res,
        message: "Semua notifikasi telah dibaca",
        data: { count: result.count },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const outletId = req.user!.outletId;
      const count = await notificationService.getUnreadCount(userId, outletId);

      sendSuccess({
        res,
        message: "Jumlah notifikasi belum dibaca",
        data: { unreadCount: count },
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) throw new BadRequestError("ID notifikasi tidak valid");
      await notificationService.delete(id, userId);

      sendSuccess({
        res,
        message: "Notifikasi berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const outletId = req.user!.outletId;
      const result = await notificationService.deleteAll(userId, outletId);

      sendSuccess({
        res,
        message: "Semua notifikasi berhasil dihapus",
        data: { count: result.count },
      });
    } catch (error) {
      next(error);
    }
  }
}
