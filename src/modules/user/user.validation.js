"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersSchema = exports.resetPasswordSchema = exports.deleteUserSchema = exports.getUserByIdSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ message: "Nama wajib diisi" })
            .min(1, "Nama tidak boleh kosong")
            .max(100, "Nama maksimal 100 karakter"),
        email: zod_1.z
            .string({ message: "Email wajib diisi" })
            .min(1, "Email tidak boleh kosong")
            .email("Format email tidak valid"),
        password: zod_1.z
            .string({ message: "Password wajib diisi" })
            .min(8, "Password minimal 8 karakter"),
        roleId: zod_1.z
            .number({ message: "Role wajib dipilih" })
            .int("Role harus berupa angka"),
        outletId: zod_1.z
            .number({ message: "Outlet harus berupa angka" })
            .int("Outlet harus berupa angka")
            .nullable()
            .optional(),
    }),
});
exports.updateUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number({ message: "ID user harus berupa angka" }),
    }),
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(1, "Nama tidak boleh kosong")
            .max(100, "Nama maksimal 100 karakter")
            .optional(),
        email: zod_1.z
            .string()
            .min(1, "Email tidak boleh kosong")
            .email("Format email tidak valid")
            .optional(),
        roleId: zod_1.z
            .number()
            .int("Role harus berupa angka")
            .optional(),
        outletId: zod_1.z
            .number()
            .int("Outlet harus berupa angka")
            .nullable()
            .optional(),
    }),
});
exports.getUserByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number({ message: "ID user harus berupa angka" }),
    }),
});
exports.deleteUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number({ message: "ID user harus berupa angka" }),
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number({ message: "ID user harus berupa angka" }),
    }),
    body: zod_1.z.object({
        password: zod_1.z
            .string({ message: "Password wajib diisi" })
            .min(8, "Password minimal 8 karakter"),
    }),
});
exports.listUsersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().int().positive().optional().default(1),
        limit: zod_1.z.coerce.number().int().positive().max(100).optional().default(10),
        search: zod_1.z.string().optional(),
        roleId: zod_1.z.coerce.number().int().optional(),
        outletId: zod_1.z.coerce.number().int().optional(),
    }),
});
//# sourceMappingURL=user.validation.js.map