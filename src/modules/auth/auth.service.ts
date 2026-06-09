import crypto from "crypto";
import { prisma } from "../../config/database";
import { UnauthorizedError, BadRequestError, NotFoundError } from "../../shared/errors";
import { sendResetPasswordEmail } from "../../config/mail";
import {
  comparePassword,
  hashPassword,
  signAccessToken,
  signRefreshToken,
  verifyToken,
  TokenPayload,
} from "../../shared/helpers";

export class AuthService {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedError("Email atau password salah");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Email atau password salah");
    }

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role.name,
      outletId: user.outletId,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = verifyToken(token);

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { role: true },
      });

      if (!user) {
        throw new UnauthorizedError("Pengguna tidak ditemukan");
      }

      const payload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role.name,
        outletId: user.outletId,
      };

      const accessToken = signAccessToken(payload);
      const refreshToken = signRefreshToken(payload);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedError("Refresh token tidak valid atau kadaluarsa");
    }
  }

  async register(name: string, email: string, password: string, roleName: string) {
    const role = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      throw new BadRequestError("Role tidak ditemukan");
    }

    if (role.name === "admin") {
      throw new BadRequestError("Tidak dapat mendaftar sebagai admin");
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestError("Email sudah terdaftar");
    }

    const outlet = await prisma.outlet.findFirst();
    if (!outlet) {
      throw new BadRequestError("Belum ada outlet yang tersedia");
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: role.id,
        outletId: outlet.id,
      },
      include: { role: true },
    });

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role.name,
      outletId: user.outletId,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });

    try {
      await sendResetPasswordEmail(user.email, user.name, token);
    } catch {
      throw new BadRequestError("Gagal mengirim email reset password");
    }
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gte: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestError("Token reset password tidak valid atau kadaluarsa");
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  }

  async googleAuth(idToken: string) {
    const { OAuth2Client } = await import("google-auth-library");
    const client = new OAuth2Client();
    const { env } = await import("../../config/env");

    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new UnauthorizedError("Token Google tidak valid");
    }

    const { email, name, picture } = payload;

    let user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedError("Akun Google tidak terdaftar. Silakan daftar terlebih dahulu.");
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role.name,
      outletId: user.outletId,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async uploadAvatar(userId: number, filename: string, baseUrl: string) {
    const avatarUrl = `${baseUrl}/uploads/avatars/${filename}`;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      include: { role: true },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
