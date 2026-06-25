"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionsQuerySchema = exports.getTransactionByIdSchema = exports.createTransactionSchema = void 0;
const zod_1 = require("zod");
exports.createTransactionSchema = zod_1.z.object({
    body: zod_1.z.object({
        discount: zod_1.z.number().nonnegative("Diskon tidak boleh negatif").optional().default(0),
        tax: zod_1.z.number().nonnegative("Pajak tidak boleh negatif").optional().default(0),
        paidAmount: zod_1.z.number({
            message: "Jumlah bayar wajib diisi",
        }).positive("Jumlah bayar harus lebih besar dari 0"),
        paymentMethodId: zod_1.z.number({
            message: "ID metode pembayaran wajib diisi",
        }).int("ID metode pembayaran harus berupa bilangan bulat"),
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.number({
                message: "ID produk wajib diisi",
            }).int("ID produk harus berupa bilangan bulat"),
            quantity: zod_1.z.number({
                message: "Kuantitas wajib diisi",
            }).positive("Kuantitas harus lebih besar dari 0"),
            discount: zod_1.z.number().nonnegative("Diskon item tidak boleh negatif").optional().default(0),
            addonIds: zod_1.z.array(zod_1.z.number().int()).optional(),
            addons: zod_1.z.array(zod_1.z.object({
                id: zod_1.z.number().int(),
                qty: zod_1.z.number().int().positive().optional().default(1),
            })).optional(),
        })).min(1, "Transaksi minimal harus memiliki 1 item"),
    }),
});
exports.getTransactionByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number({
            message: "ID transaksi harus berupa angka",
        }),
    }),
});
exports.getTransactionsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().int().positive().default(1),
        limit: zod_1.z.coerce.number().int().positive().default(10),
        startDate: zod_1.z.string().datetime().optional().or(zod_1.z.string().date().optional()),
        endDate: zod_1.z.string().datetime().optional().or(zod_1.z.string().date().optional()),
        userId: zod_1.z.coerce.number().int().optional(),
        paymentMethodId: zod_1.z.coerce.number().int().optional(),
        search: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=transaction.validation.js.map