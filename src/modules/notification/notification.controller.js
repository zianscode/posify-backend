"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = require("./notification.service");
const response_1 = require("../../shared/response");
const errors_1 = require("../../shared/errors");
const notificationService = new notification_service_1.NotificationService();
class NotificationController {
    async findAll(req, res, next) {
        try {
            const userId = req.user.userId;
            const outletId = req.user.outletId;
            const result = await notificationService.findAll(userId, outletId);
            (0, response_1.sendSuccess)({
                res,
                message: "Daftar notifikasi berhasil diambil",
                data: result.notifications,
                meta: { unreadCount: result.unreadCount },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async markAsRead(req, res, next) {
        try {
            const userId = req.user.userId;
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw new errors_1.BadRequestError("ID notifikasi tidak valid");
            await notificationService.markAsRead(id, userId);
            (0, response_1.sendSuccess)({
                res,
                message: "Notifikasi telah dibaca",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async markAllAsRead(req, res, next) {
        try {
            const userId = req.user.userId;
            const outletId = req.user.outletId;
            const result = await notificationService.markAllAsRead(userId, outletId);
            (0, response_1.sendSuccess)({
                res,
                message: "Semua notifikasi telah dibaca",
                data: { count: result.count },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getUnreadCount(req, res, next) {
        try {
            const userId = req.user.userId;
            const outletId = req.user.outletId;
            const count = await notificationService.getUnreadCount(userId, outletId);
            (0, response_1.sendSuccess)({
                res,
                message: "Jumlah notifikasi belum dibaca",
                data: { unreadCount: count },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const userId = req.user.userId;
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw new errors_1.BadRequestError("ID notifikasi tidak valid");
            await notificationService.delete(id, userId);
            (0, response_1.sendSuccess)({
                res,
                message: "Notifikasi berhasil dihapus",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteAll(req, res, next) {
        try {
            const userId = req.user.userId;
            const outletId = req.user.outletId;
            const result = await notificationService.deleteAll(userId, outletId);
            (0, response_1.sendSuccess)({
                res,
                message: "Semua notifikasi berhasil dihapus",
                data: { count: result.count },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map