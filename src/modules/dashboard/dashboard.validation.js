"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopProductsQuerySchema = exports.getSalesTrendQuerySchema = exports.getSummaryQuerySchema = void 0;
const zod_1 = require("zod");
// Helper to validate date string format
const dateSchema = zod_1.z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
    message: "Format tanggal tidak valid",
})
    .optional();
exports.getSummaryQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        startDate: dateSchema,
        endDate: dateSchema,
    }),
});
exports.getSalesTrendQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        days: zod_1.z.coerce.number().int().positive().optional().default(7),
        startDate: dateSchema,
        endDate: dateSchema,
    }),
});
exports.getTopProductsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        limit: zod_1.z.coerce.number().int().positive().optional().default(5),
        startDate: dateSchema,
        endDate: dateSchema,
    }),
});
//# sourceMappingURL=dashboard.validation.js.map