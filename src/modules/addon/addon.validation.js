"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddOnByIdSchema = exports.updateAddOnSchema = exports.createAddOnSchema = void 0;
const zod_1 = require("zod");
exports.createAddOnSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            message: "Nama add-on wajib diisi",
        })
            .min(1, "Nama add-on tidak boleh kosong")
            .max(100, "Nama add-on maksimal 100 karakter"),
        price: zod_1.z.number({
            message: "Harga add-on wajib diisi",
        }).positive("Harga add-on harus lebih besar dari 0"),
        description: zod_1.z.string().optional().nullable(),
    }),
});
exports.updateAddOnSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number({
            message: "ID add-on harus berupa angka",
        }),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string()
            .min(1, "Nama add-on tidak boleh kosong")
            .max(100, "Nama add-on maksimal 100 karakter")
            .optional(),
        price: zod_1.z.number().positive("Harga add-on harus lebih besar dari 0").optional(),
        description: zod_1.z.string().optional().nullable(),
    }),
});
exports.getAddOnByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number({
            message: "ID add-on harus berupa angka",
        }),
    }),
});
//# sourceMappingURL=addon.validation.js.map