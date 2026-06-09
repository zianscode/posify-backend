import { prisma } from "../../config/database";
import { hashPassword, comparePassword } from "../../shared/helpers";
import {
  NotFoundError,
  BadRequestError,
  ConflictError,
} from "../../shared/errors";

export class UserService {
  async createUser(data: {
    name: string;
    email: string;
    password: string;
    roleId: number;
    outletId?: number | null;
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictError("Email sudah terdaftar");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
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

  async getUsers(params: {
    page: number;
    limit: number;
    search?: string;
    roleId?: number;
    outletId?: number;
  }) {
    const { page, limit, search, roleId, outletId } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

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
      prisma.user.findMany({
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
      prisma.user.count({ where }),
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

  async getUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        outlet: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User tidak ditemukan");
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(
    id: number,
    data: {
      name?: string;
      email?: string;
      roleId?: number;
      outletId?: number | null;
    },
  ) {
    await this.getUserById(id);

    if (data.email !== undefined) {
      const existing = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existing && existing.id !== id) {
        throw new ConflictError("Email sudah digunakan user lain");
      }
    }

    const user = await prisma.user.update({
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

  async deleteUser(id: number, currentUserId: number) {
    if (id === currentUserId) {
      throw new BadRequestError("Tidak dapat menghapus akun sendiri");
    }

    await this.getUserById(id);

    const transactionCount = await prisma.transaction.count({
      where: { userId: id },
    });

    if (transactionCount > 0) {
      throw new BadRequestError(
        "User tidak dapat dihapus karena memiliki data transaksi",
      );
    }

    await prisma.user.delete({
      where: { id },
    });
  }

  async resetPassword(id: number, newPassword: string) {
    await this.getUserById(id);

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async getProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        outlet: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User tidak ditemukan");
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(
    userId: number,
    data: {
      name?: string;
      email?: string;
    },
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User tidak ditemukan");
    }

    if (data.email && data.email !== user.email) {
      const existing = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existing) {
        throw new ConflictError("Email sudah digunakan user lain");
      }
    }

    const updated = await prisma.user.update({
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

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User tidak ditemukan");
    }

    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) {
      throw new BadRequestError("Password saat ini salah");
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}
