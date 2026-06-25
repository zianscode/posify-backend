"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsQuerySchema = exports.getProductByIdSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            message: "Nama produk wajib diisi",
        }).min(1, "Nama produk tidak boleh kosong"),
        barcode: zod_1.z.string().optional().nullable(),
        description: zod_1.z.string().optional().nullable(),
        price: zod_1.z.number({
            message: "Harga jual wajib diisi",
        }).positive("Harga jual harus lebih besar dari 0"),
        costPrice: zod_1.z.number({
            message: "Harga pokok wajib diisi",
        }).nonnegative("Harga pokok tidak boleh negatif"),
        stock: zod_1.z.number().nonnegative("Stok tidak boleh negatif").default(0),
        minStock: zod_1.z.number().nonnegative("Minimal stok tidak boleh negatif").default(0),
        categoryId: zod_1.z.number({
            message: "ID kategori wajib diisi",
        }).int("ID kategori harus berupa bilangan bulat"),
        unitId: zod_1.z.number({
            message: "ID unit wajib diisi",
        }).int("ID unit harus berupa bilangan bulat"),
    }),
});
exports.updateProductSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number({
            message: "ID produk harus berupa angka",
        }),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Nama produk tidak boleh kosong").optional(),
        barcode: zod_1.z.string().optional().nullable(),
        description: zod_1.z.string().optional().nullable(),
        price: zod_1.z.number().positive("Harga jual harus lebih besar dari 0").optional(),
        costPrice: zod_1.z.number().nonnegative("Harga pokok tidak boleh negatif").optional(),
        stock: zod_1.z.number().nonnegative("Stok tidak boleh negatif").optional(),
        minStock: zod_1.z.number().nonnegative("Minimal stok tidak boleh negatif").optional(),
        categoryId: zod_1.z.number().int("ID kategori harus berupa bilangan bulat").optional(),
        unitId: zod_1.z.number().int("ID unit harus berupa bilangan bulat").optional(),
    }),
});
exports.getProductByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number({
            message: "ID produk harus berupa angka",
        }),
    }),
});
exports.getProductsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().int().positive().default(1),
        limit: zod_1.z.coerce.number().int().positive().default(10),
        search: zod_1.z.string().optional(),
        categoryId: zod_1.z.coerce.number().int().optional(),
        unitId: zod_1.z.coerce.number().int().optional(),
        lowStock: zod_1.z.preprocess((val) => val === "true", zod_1.z.boolean()).optional(),
    }),
});
//# sourceMappingURL=product.validation.js.map