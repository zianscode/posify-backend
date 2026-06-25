"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.changePasswordSchema = exports.googleAuthSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.registerSchema = exports.refreshTokenSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
        password: zod_1.z.string().min(8, "Password minimal 8 karakter"),
    }),
});
exports.refreshTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, "Refresh token wajib diisi"),
    }),
});
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ message: "Nama wajib diisi" }).min(1, "Nama tidak boleh kosong").max(100, "Nama maksimal 100 karakter"),
        email: zod_1.z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
        password: zod_1.z.string().min(8, "Password minimal 8 karakter"),
        role: zod_1.z.enum(["manager", "kasir"], { message: "Role harus manager atau kasir" }),
    }),
});
exports.forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string().min(1, "Token wajib diisi"),
        password: zod_1.z.string().min(8, "Password minimal 8 karakter"),
    }),
});
exports.googleAuthSchema = zod_1.z.object({
    body: zod_1.z.object({
        idToken: zod_1.z.string().min(1, "ID token wajib diisi"),
    }),
});
exports.changePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z
            .string({ message: "Password saat ini wajib diisi" })
            .min(1, "Password saat ini tidak boleh kosong"),
        newPassword: zod_1.z
            .string({ message: "Password baru wajib diisi" })
            .min(8, "Password baru minimal 8 karakter"),
    }),
});
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ message: "Nama wajib diisi" })
            .min(1, "Nama tidak boleh kosong")
            .max(100, "Nama maksimal 100 karakter")
            .optional(),
        email: zod_1.z
            .string({ message: "Email wajib diisi" })
            .min(1, "Email tidak boleh kosong")
            .email("Format email tidak valid")
            .optional(),
    }),
});
//# sourceMappingURL=auth.validation.js.map