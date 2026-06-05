import { prisma } from "../../config/database";
import { getIO } from "../../config/socket";
import { NotFoundError } from "../../shared/errors";
import { NotificationType } from "../../generated/prisma";

interface CreateNotificationParams {
  type: NotificationType;
  title: string;
  message?: string;
  link?: string;
  outletId?: number | null;
  userId?: number | null;
}

export class NotificationService {
  async findAll(userId: number, outletId: number | null) {
    const where: any = {
      OR: [{ userId: userId }, { userId: null }],
    };

    if (outletId) {
      where.OR = [
        { userId: userId },
        { outletId: outletId },
        { AND: [{ userId: null }, { outletId: null }] },
      ];
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { ...where, isRead: false },
    });

    return { notifications, unreadCount };
  }

  async markAsRead(id: number, userId: number) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundError("Notifikasi tidak ditemukan");
    }

    if (notification.userId && notification.userId !== userId) {
      throw new NotFoundError("Notifikasi tidak ditemukan");
    }

    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: number, outletId: number | null) {
    const where: any = {
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

    return prisma.notification.updateMany({
      where,
      data: { isRead: true },
    });
  }

  async create(data: CreateNotificationParams) {
    const notification = await prisma.notification.create({
      data: {
        type: data.type,
        title: data.title,
        message: data.message ?? null,
        link: data.link ?? null,
        outletId: data.outletId ?? null,
        userId: data.userId ?? null,
      },
    });

    const io = getIO();

    if (data.outletId) {
      io.to(`outlet:${data.outletId}`).emit("new-notification", notification);
    }

    io.emit("new-notification", notification);

    return notification;
  }

  async delete(id: number, userId: number) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundError("Notifikasi tidak ditemukan");
    }

    if (notification.userId && notification.userId !== userId) {
      throw new NotFoundError("Notifikasi tidak ditemukan");
    }

    return prisma.notification.delete({ where: { id } });
  }

  async deleteAll(userId: number, outletId: number | null) {
    const where: any = {
      OR: [{ userId: userId }, { userId: null }],
    };

    if (outletId) {
      where.OR = [
        { userId: userId },
        { outletId: outletId },
        { AND: [{ userId: null }, { outletId: null }] },
      ];
    }

    return prisma.notification.deleteMany({ where });
  }

  async getUnreadCount(userId: number, outletId: number | null) {
    const where: any = {
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

    return prisma.notification.count({ where });
  }
}
