import { z } from "zod";

export const createSettingSchema = z.object({
  body: z.object({
    key: z
      .string({ message: "Key wajib diisi" })
      .min(1, "Key tidak boleh kosong")
      .max(100, "Key maksimal 100 karakter"),
    value: z
      .string({ message: "Value wajib diisi" })
      .min(1, "Value tidak boleh kosong"),
    description: z
      .string()
      .optional(),
  }),
});

export const updateSettingSchema = z.object({
  params: z.object({
    id: z.coerce.number({ message: "ID setting harus berupa angka" }),
  }),
  body: z.object({
    value: z
      .string({ message: "Value wajib diisi" })
      .min(1, "Value tidak boleh kosong"),
    description: z
      .string()
      .optional(),
  }),
});

export const getSettingByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number({ message: "ID setting harus berupa angka" }),
  }),
});
