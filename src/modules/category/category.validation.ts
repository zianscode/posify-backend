import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string({
      message: "Nama kategori wajib diisi",
    })
      .min(1, "Nama kategori tidak boleh kosong")
      .max(100, "Nama kategori maksimal 100 karakter"),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.coerce.number({
      message: "ID kategori harus berupa angka",
    }),
  }),
  body: z.object({
    name: z.string({
      message: "Nama kategori wajib diisi",
    })
      .min(1, "Nama kategori tidak boleh kosong")
      .max(100, "Nama kategori maksimal 100 karakter"),
  }),
});

export const getCategoryByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number({
      message: "ID kategori harus berupa angka",
    }),
  }),
});
