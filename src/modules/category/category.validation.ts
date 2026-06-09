import { z } from "zod";

export const getCategoryByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number({
      message: "ID kategori harus berupa angka",
    }),
  }),
});
