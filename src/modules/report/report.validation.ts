import { z } from "zod";

const dateSchema = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), { message: "Format tanggal tidak valid" })
  .optional();

export const salesReportQuerySchema = z.object({
  query: z.object({
    startDate: dateSchema,
    endDate: dateSchema,
    format: z.enum(["json", "csv"]).optional().default("json"),
  }),
});

export const productReportQuerySchema = z.object({
  query: z.object({
    startDate: dateSchema,
    endDate: dateSchema,
    limit: z.coerce.number().int().positive().optional().default(10),
    format: z.enum(["json", "csv"]).optional().default("json"),
  }),
});

export const stockReportQuerySchema = z.object({
  query: z.object({
    format: z.enum(["json", "csv"]).optional().default("json"),
  }),
});
