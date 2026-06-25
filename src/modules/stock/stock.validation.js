"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovementsSchema = exports.adjustStockSchema = void 0;
const zod_1 = require("zod");
exports.adjustStockSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z.number({
            message: "ID produk wajib diisi",
        }).int("ID produk harus berupa bilangan bulat"),
        quantity: zod_1.z.number({
            message: "Kuantitas stok wajib diisi",
        }).positive("Kuantitas harus lebih besar dari 0"),
        type: zod_1.z.enum(["IN", "OUT"], {
            message: "Tipe penyesuaian harus berupa 'IN' atau 'OUT'",
        }),
        description: zod_1.z.string().optional().nullable(),
    }),
});
exports.getMovementsSchema = zod_1.z.object({
    params: zod_1.z.object({
        productId: zod_1.z.coerce.number({
            message: "ID produk harus berupa angka",
        }),
    }),
});
//# sourceMappingURL=stock.validation.js.map