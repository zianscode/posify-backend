"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockReportQuerySchema = exports.productReportQuerySchema = exports.salesReportQuerySchema = void 0;
const zod_1 = require("zod");
const dateSchema = zod_1.z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Format tanggal tidak valid" })
    .optional();
exports.salesReportQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        startDate: dateSchema,
        endDate: dateSchema,
        format: zod_1.z.enum(["json", "csv"]).optional().default("json"),
    }),
});
exports.productReportQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        startDate: dateSchema,
        endDate: dateSchema,
        limit: zod_1.z.coerce.number().int().positive().optional().default(10),
        format: zod_1.z.enum(["json", "csv"]).optional().default("json"),
    }),
});
exports.stockReportQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        format: zod_1.z.enum(["json", "csv"]).optional().default("json"),
    }),
});
//# sourceMappingURL=report.validation.js.map