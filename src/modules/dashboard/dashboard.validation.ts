import { z } from "zod";

// Helper to validate date string format
const dateSchema = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Format tanggal tidak valid",
  })
  .optional();

export const getSummaryQuerySchema = z.object({
  query: z.object({
    startDate: dateSchema,
    endDate: dateSchema,
  }),
});

export const getSalesTrendQuerySchema = z.object({
  query: z.object({
    days: z.coerce.number().int().positive().optional().default(7),
    startDate: dateSchema,
    endDate: dateSchema,
  }),
});

export const getTopProductsQuerySchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().positive().optional().default(5),
    startDate: dateSchema,
    endDate: dateSchema,
  }),
});
