import { z } from "zod";
export declare const salesReportQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        format: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            json: "json";
            csv: "csv";
        }>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const productReportQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        limit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
        format: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            json: "json";
            csv: "csv";
        }>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const stockReportQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        format: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            json: "json";
            csv: "csv";
        }>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=report.validation.d.ts.map