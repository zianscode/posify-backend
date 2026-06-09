import { z } from "zod";

export const createTransactionSchema = z.object({
  body: z.object({
    discount: z.number().nonnegative("Diskon tidak boleh negatif").optional().default(0),
    tax: z.number().nonnegative("Pajak tidak boleh negatif").optional().default(0),
    paidAmount: z.number({
      message: "Jumlah bayar wajib diisi",
    }).positive("Jumlah bayar harus lebih besar dari 0"),
    paymentMethodId: z.number({
      message: "ID metode pembayaran wajib diisi",
    }).int("ID metode pembayaran harus berupa bilangan bulat"),
    items: z.array(
      z.object({
        productId: z.number({
          message: "ID produk wajib diisi",
        }).int("ID produk harus berupa bilangan bulat"),
        quantity: z.number({
          message: "Kuantitas wajib diisi",
        }).positive("Kuantitas harus lebih besar dari 0"),
        discount: z.number().nonnegative("Diskon item tidak boleh negatif").optional().default(0),
      })
    ).min(1, "Transaksi minimal harus memiliki 1 item"),
  }),
});

export const getTransactionByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number({
      message: "ID transaksi harus berupa angka",
    }),
  }),
});

export const getTransactionsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    startDate: z.string().datetime().optional().or(z.string().date().optional()),
    endDate: z.string().datetime().optional().or(z.string().date().optional()),
    userId: z.coerce.number().int().optional(),
    paymentMethodId: z.coerce.number().int().optional(),
    search: z.string().optional(),
  }),
});
