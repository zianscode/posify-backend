import { z } from "zod";

export const createAddOnSchema = z.object({
  body: z.object({
    name: z.string({
      message: "Nama add-on wajib diisi",
    })
      .min(1, "Nama add-on tidak boleh kosong")
      .max(100, "Nama add-on maksimal 100 karakter"),
    price: z.number({
      message: "Harga add-on wajib diisi",
    }).positive("Harga add-on harus lebih besar dari 0"),
    description: z.string().optional().nullable(),
  }),
});

export const updateAddOnSchema = z.object({
  params: z.object({
    id: z.coerce.number({
      message: "ID add-on harus berupa angka",
    }),
  }),
  body: z.object({
    name: z.string()
      .min(1, "Nama add-on tidak boleh kosong")
      .max(100, "Nama add-on maksimal 100 karakter")
      .optional(),
    price: z.number().positive("Harga add-on harus lebih besar dari 0").optional(),
    description: z.string().optional().nullable(),
  }),
});

export const getAddOnByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number({
      message: "ID add-on harus berupa angka",
    }),
  }),
});
