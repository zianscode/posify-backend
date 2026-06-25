"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = require("../../config/database");
const helpers_1 = require("../../shared/helpers");
const errors_1 = require("../../shared/errors");
class UserService {
    async createUser(data) {
        const existing = await database_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existing) {
            throw new errors_1.ConflictError("Email sudah terdaftar");
        }
        const hashedPassword = await (0, helpers_1.hashPassword)(data.password);
        const user = await database_1.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                roleId: data.roleId,
                outletId: data.outletId ?? null,
            },
            include: {
                role: true,
                outlet: true,
            },
        });
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async getUsers(params) {
        const { page, limit, search, roleId, outletId } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ];
        }
        if (roleId) {
            where.roleId = roleId;
        }
        if (outletId) {
            where.outletId = outletId;
        }
        const [users, total] = await Promise.all([
            database_1.prisma.user.findMany({
                where,
                skip,
                take: limit,
                include: {
                    role: true,
                    outlet: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            database_1.prisma.user.count({ where }),
        ]);
        const usersWithoutPassword = users.map(({ password: _, ...rest }) => rest);
        return {
            data: usersWithoutPassword,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getUserById(id) {
        const user = await database_1.prisma.user.findUnique({
            where: { id },
            include: {
                role: true,
                outlet: true,
            },
        });
        if (!user) {
            throw new errors_1.NotFoundError("User tidak ditemukan");
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async updateUser(id, data) {
        await this.getUserById(id);
        if (data.email !== undefined) {
            const existing = await database_1.prisma.user.findUnique({
                where: { email: data.email },
            });
            if (existing && existing.id !== id) {
                throw new errors_1.ConflictError("Email sudah digunakan user lain");
            }
        }
        const user = await database_1.prisma.user.update({
            where: { id },
            data,
            include: {
                role: true,
                outlet: true,
            },
        });
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async deleteUser(id, currentUserId) {
        if (id === currentUserId) {
            throw new errors_1.BadRequestError("Tidak dapat menghapus akun sendiri");
        }
        await this.getUserById(id);
        const transactionCount = await database_1.prisma.transaction.count({
            where: { userId: id },
        });
        if (transactionCount > 0) {
            throw new errors_1.BadRequestError("User tidak dapat dihapus karena memiliki data transaksi");
        }
        await database_1.prisma.user.delete({
            where: { id },
        });
    }
    async resetPassword(id, newPassword) {
        await this.getUserById(id);
        const hashedPassword = await (0, helpers_1.hashPassword)(newPassword);
        await database_1.prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });
    }
    async getProfile(userId) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                role: true,
                outlet: true,
            },
        });
        if (!user) {
            throw new errors_1.NotFoundError("User tidak ditemukan");
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async updateProfile(userId, data) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new errors_1.NotFoundError("User tidak ditemukan");
        }
        if (data.email && data.email !== user.email) {
            const existing = await database_1.prisma.user.findUnique({
                where: { email: data.email },
            });
            if (existing) {
                throw new errors_1.ConflictError("Email sudah digunakan user lain");
            }
        }
        const updated = await database_1.prisma.user.update({
            where: { id: userId },
            data,
            include: {
                role: true,
                outlet: true,
            },
        });
        const { password: _, ...userWithoutPassword } = updated;
        return userWithoutPassword;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new errors_1.NotFoundError("User tidak ditemukan");
        }
        const isValid = await (0, helpers_1.comparePassword)(currentPassword, user.password);
        if (!isValid) {
            throw new errors_1.BadRequestError("Password saat ini salah");
        }
        const hashedPassword = await (0, helpers_1.hashPassword)(newPassword);
        await database_1.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map