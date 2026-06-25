import { NotificationType } from "../../generated/prisma";
interface CreateNotificationParams {
    type: NotificationType;
    title: string;
    message?: string;
    link?: string;
    outletId?: number | null;
    userId?: number | null;
}
export declare class NotificationService {
    findAll(userId: number, outletId: number | null): Promise<{
        notifications: {
            id: number;
            outletId: number | null;
            createdAt: Date;
            link: string | null;
            type: import("../../generated/prisma").$Enums.NotificationType;
            message: string | null;
            userId: number | null;
            title: string;
            isRead: boolean;
        }[];
        unreadCount: number;
    }>;
    markAsRead(id: number, userId: number): Promise<{
        id: number;
        outletId: number | null;
        createdAt: Date;
        link: string | null;
        type: import("../../generated/prisma").$Enums.NotificationType;
        message: string | null;
        userId: number | null;
        title: string;
        isRead: boolean;
    }>;
    markAllAsRead(userId: number, outletId: number | null): Promise<import("../../generated/prisma").Prisma.BatchPayload>;
    create(data: CreateNotificationParams): Promise<{
        id: number;
        outletId: number | null;
        createdAt: Date;
        link: string | null;
        type: import("../../generated/prisma").$Enums.NotificationType;
        message: string | null;
        userId: number | null;
        title: string;
        isRead: boolean;
    }>;
    delete(id: number, userId: number): Promise<{
        id: number;
        outletId: number | null;
        createdAt: Date;
        link: string | null;
        type: import("../../generated/prisma").$Enums.NotificationType;
        message: string | null;
        userId: number | null;
        title: string;
        isRead: boolean;
    }>;
    deleteAll(userId: number, outletId: number | null): Promise<import("../../generated/prisma").Prisma.BatchPayload>;
    getUnreadCount(userId: number, outletId: number | null): Promise<number>;
}
export {};
//# sourceMappingURL=notification.service.d.ts.map