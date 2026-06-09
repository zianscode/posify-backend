import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string({
      message: "Nama produk wajib diisi",
    }).min(1, "Nama produk tidak boleh kosong"),
    barcode: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    price: z.number({
      message: "Harga jual wajib diisi",
    }).positive("Harga jual harus lebih besar dari 0"),
    costPrice: z.number({
      message: "Harga pokok wajib diisi",
    }).nonnegative("Harga pokok tidak boleh negatif"),
    stock: z.number().nonnegative("Stok tidak boleh negatif").default(0),
    minStock: z.number().nonnegative("Minimal stok tidak boleh negatif").default(0),
    categoryId: z.number({
      message: "ID kategori wajib diisi",
    }).int("ID kategori harus berupa bilangan bulat"),
    unitId: z.number({
      message: "ID unit wajib diisi",
    }).int("ID unit harus berupa bilangan bulat"),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.coerce.number({
      message: "ID produk harus berupa angka",
    }),
  }),
  body: z.object({
    name: z.string().min(1, "Nama produk tidak boleh kosong").optional(),
    barcode: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    price: z.number().positive("Harga jual harus lebih besar dari 0").optional(),
    costPrice: z.number().nonnegative("Harga pokok tidak boleh negatif").optional(),
    stock: z.number().nonnegative("Stok tidak boleh negatif").optional(),
    minStock: z.number().nonnegative("Minimal stok tidak boleh negatif").optional(),
    categoryId: z.number().int("ID kategori harus berupa bilangan bulat").optional(),
    unitId: z.number().int("ID unit harus berupa bilangan bulat").optional(),
  }),
});

export const getProductByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number({
      message: "ID produk harus berupa angka",
    }),
  }),
});

export const getProductsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    search: z.string().optional(),
    categoryId: z.coerce.number().int().optional(),
    unitId: z.coerce.number().int().optional(),
    lowStock: z.preprocess((val) => val === "true", z.boolean()).optional(),
  }),
});
