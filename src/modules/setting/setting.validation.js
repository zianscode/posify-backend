"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettingByIdSchema = exports.updateSettingSchema = exports.createSettingSchema = void 0;
const zod_1 = require("zod");
exports.createSettingSchema = zod_1.z.object({
    body: zod_1.z.object({
        key: zod_1.z
            .string({ message: "Key wajib diisi" })
            .min(1, "Key tidak boleh kosong")
            .max(100, "Key maksimal 100 karakter"),
        value: zod_1.z
            .string({ message: "Value wajib diisi" })
            .min(1, "Value tidak boleh kosong"),
        description: zod_1.z
            .string()
            .optional(),
    }),
});
exports.updateSettingSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number({ message: "ID setting harus berupa angka" }),
    }),
    body: zod_1.z.object({
        value: zod_1.z
            .string({ message: "Value wajib diisi" })
            .min(1, "Value tidak boleh kosong"),
        description: zod_1.z
            .string()
            .optional(),
    }),
});
exports.getSettingByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number({ message: "ID setting harus berupa angka" }),
    }),
});
//# sourceMappingURL=setting.validation.js.map