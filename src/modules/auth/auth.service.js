"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const database_1 = require("../../config/database");
const errors_1 = require("../../shared/errors");
const mail_1 = require("../../config/mail");
const helpers_1 = require("../../shared/helpers");
class AuthService {
    async login(email, password) {
        const user = await database_1.prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });
        if (!user) {
            throw new errors_1.UnauthorizedError("Email atau password salah");
        }
        const isPasswordValid = await (0, helpers_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            throw new errors_1.UnauthorizedError("Email atau password salah");
        }
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role.name,
            outletId: user.outletId,
        };
        const accessToken = (0, helpers_1.signAccessToken)(payload);
        const refreshToken = (0, helpers_1.signRefreshToken)(payload);
        const { password: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        };
    }
    async refreshToken(token) {
        try {
            const decoded = (0, helpers_1.verifyToken)(token);
            const user = await database_1.prisma.user.findUnique({
                where: { id: decoded.userId },
                include: { role: true },
            });
            if (!user) {
                throw new errors_1.UnauthorizedError("Pengguna tidak ditemukan");
            }
            const payload = {
                userId: user.id,
                email: user.email,
                role: user.role.name,
                outletId: user.outletId,
            };
            const accessToken = (0, helpers_1.signAccessToken)(payload);
            const refreshToken = (0, helpers_1.signRefreshToken)(payload);
            return { accessToken, refreshToken };
        }
        catch (error) {
            throw new errors_1.UnauthorizedError("Refresh token tidak valid atau kadaluarsa");
        }
    }
    async register(name, email, password, roleName) {
        const role = await database_1.prisma.role.findUnique({
            where: { name: roleName },
        });
        if (!role) {
            throw new errors_1.BadRequestError("Role tidak ditemukan");
        }
        if (role.name === "admin") {
            throw new errors_1.BadRequestError("Tidak dapat mendaftar sebagai admin");
        }
        const existingUser = await database_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new errors_1.BadRequestError("Email sudah terdaftar");
        }
        const outlet = await database_1.prisma.outlet.findFirst();
        if (!outlet) {
            throw new errors_1.BadRequestError("Belum ada outlet yang tersedia");
        }
        const hashedPassword = await (0, helpers_1.hashPassword)(password);
        const user = await database_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                roleId: role.id,
                outletId: outlet.id,
            },
            include: { role: true },
        });
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role.name,
            outletId: user.outletId,
        };
        const accessToken = (0, helpers_1.signAccessToken)(payload);
        const refreshToken = (0, helpers_1.signRefreshToken)(payload);
        const { password: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        };
    }
    async forgotPassword(email) {
        const user = await database_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return;
        }
        const token = crypto_1.default.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 60 * 60 * 1000);
        await database_1.prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: token,
                resetPasswordExpires: expires,
            },
        });
        try {
            await (0, mail_1.sendResetPasswordEmail)(user.email, user.name, token);
        }
        catch {
            throw new errors_1.BadRequestError("Gagal mengirim email reset password");
        }
    }
    async resetPassword(token, newPassword) {
        const user = await database_1.prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gte: new Date() },
            },
        });
        if (!user) {
            throw new errors_1.BadRequestError("Token reset password tidak valid atau kadaluarsa");
        }
        const hashedPassword = await (0, helpers_1.hashPassword)(newPassword);
        await database_1.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });
    }
    async googleAuth(idToken) {
        const { OAuth2Client } = await Promise.resolve().then(() => __importStar(require("google-auth-library")));
        const client = new OAuth2Client();
        const { env } = await Promise.resolve().then(() => __importStar(require("../../config/env")));
        const ticket = await client.verifyIdToken({
            idToken,
            audience: env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new errors_1.UnauthorizedError("Token Google tidak valid");
        }
        const { email, name, picture } = payload;
        let user = await database_1.prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });
        if (!user) {
            throw new errors_1.UnauthorizedError("Akun Google tidak terdaftar. Silakan daftar terlebih dahulu.");
        }
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role.name,
            outletId: user.outletId,
        };
        const accessToken = (0, helpers_1.signAccessToken)(tokenPayload);
        const refreshToken = (0, helpers_1.signRefreshToken)(tokenPayload);
        const { password: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        };
    }
    async uploadAvatar(userId, filename, baseUrl) {
        const avatarUrl = `${baseUrl}/uploads/avatars/${filename}`;
        const user = await database_1.prisma.user.update({
            where: { id: userId },
            data: { avatar: avatarUrl },
            include: { role: true },
        });
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map