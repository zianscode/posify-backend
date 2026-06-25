"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const database_1 = require("../../config/database");
const socket_1 = require("../../config/socket");
const errors_1 = require("../../shared/errors");
class NotificationService {
    async findAll(userId, outletId) {
        const where = {
            OR: [{ userId: userId }, { userId: null }],
        };
        if (outletId) {
            where.OR = [
                { userId: userId },
                { outletId: outletId },
                { AND: [{ userId: null }, { outletId: null }] },
            ];
        }
        const notifications = await database_1.prisma.notification.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: 50,
        });
        const unreadCount = await database_1.prisma.notification.count({
            where: { ...where, isRead: false },
        });
        return { notifications, unreadCount };
    }
    async markAsRead(id, userId) {
        const notification = await database_1.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new errors_1.NotFoundError("Notifikasi tidak ditemukan");
        }
        if (notification.userId && notification.userId !== userId) {
            throw new errors_1.NotFoundError("Notifikasi tidak ditemukan");
        }
        return database_1.prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }
    async markAllAsRead(userId, outletId) {
        const where = {
            OR: [{ userId: userId }, { userId: null }],
            isRead: false,
        };
        if (outletId) {
            where.OR = [
                { userId: userId },
                { outletId: outletId },
                { AND: [{ userId: null }, { outletId: null }] },
            ];
        }
        return database_1.prisma.notification.updateMany({
            where,
            data: { isRead: true },
        });
    }
    async create(data) {
        const notification = await database_1.prisma.notification.create({
            data: {
                type: data.type,
                title: data.title,
                message: data.message ?? null,
                link: data.link ?? null,
                outletId: data.outletId ?? null,
                userId: data.userId ?? null,
            },
        });
        const io = (0, socket_1.getIO)();
        if (data.outletId) {
            io.to(`outlet:${data.outletId}`).emit("new-notification", notification);
        }
        else {
            io.emit("new-notification", notification);
        }
        return notification;
    }
    async delete(id, userId) {
        const notification = await database_1.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new errors_1.NotFoundError("Notifikasi tidak ditemukan");
        }
        if (notification.userId && notification.userId !== userId) {
            throw new errors_1.NotFoundError("Notifikasi tidak ditemukan");
        }
        return database_1.prisma.notification.delete({ where: { id } });
    }
    async deleteAll(userId, outletId) {
        const where = {
            OR: [{ userId: userId }, { userId: null }],
        };
        if (outletId) {
            where.OR = [
                { userId: userId },
                { outletId: outletId },
                { AND: [{ userId: null }, { outletId: null }] },
            ];
        }
        return database_1.prisma.notification.deleteMany({ where });
    }
    async getUnreadCount(userId, outletId) {
        const where = {
            OR: [{ userId: userId }, { userId: null }],
            isRead: false,
        };
        if (outletId) {
            where.OR = [
                { userId: userId },
                { outletId: outletId },
                { AND: [{ userId: null }, { outletId: null }] },
            ];
        }
        return database_1.prisma.notification.count({ where });
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map