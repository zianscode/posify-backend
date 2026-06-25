import { z } from "zod";
export declare const adjustStockSchema: z.ZodObject<{
    body: z.ZodObject<{
        productId: z.ZodNumber;
        quantity: z.ZodNumber;
        type: z.ZodEnum<{
            IN: "IN";
            OUT: "OUT";
        }>;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getMovementsSchema: z.ZodObject<{
    params: z.ZodObject<{
        productId: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=stock.validation.d.ts.map