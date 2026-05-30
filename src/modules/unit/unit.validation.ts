import { z } from "zod";

export const createUnitSchema = z.object({
  body: z.object({
    name: z.string({
      message: "Nama unit wajib diisi",
    })
      .min(1, "Nama unit tidak boleh kosong")
      .max(50, "Nama unit maksimal 50 karakter"),
  }),
});

export const updateUnitSchema = z.object({
  params: z.object({
    id: z.coerce.number({
      message: "ID unit harus berupa angka",
    }),
  }),
  body: z.object({
    name: z.string({
      message: "Nama unit wajib diisi",
    })
      .min(1, "Nama unit tidak boleh kosong")
      .max(50, "Nama unit maksimal 50 karakter"),
  }),
});

export const getUnitByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number({
      message: "ID unit harus berupa angka",
    }),
  }),
});
