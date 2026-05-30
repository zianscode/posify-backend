import { z } from "zod";

export const adjustStockSchema = z.object({
  body: z.object({
    productId: z.number({
      message: "ID produk wajib diisi",
    }).int("ID produk harus berupa bilangan bulat"),
    quantity: z.number({
      message: "Kuantitas stok wajib diisi",
    }).positive("Kuantitas harus lebih besar dari 0"),
    type: z.enum(["IN", "OUT"], {
      message: "Tipe penyesuaian harus berupa 'IN' atau 'OUT'",
    }),
    description: z.string().optional().nullable(),
  }),
});

export const getMovementsSchema = z.object({
  params: z.object({
    productId: z.coerce.number({
      message: "ID produk harus berupa angka",
    }),
  }),
});
