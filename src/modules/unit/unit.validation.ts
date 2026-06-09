import { z } from "zod";

export const getUnitByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number({
      message: "ID unit harus berupa angka",
    }),
  }),
});
