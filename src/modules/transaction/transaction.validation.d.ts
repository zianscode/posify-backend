import { z } from "zod";
export declare const createTransactionSchema: z.ZodObject<{
    body: z.ZodObject<{
        discount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        tax: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        paidAmount: z.ZodNumber;
        paymentMethodId: z.ZodNumber;
        items: z.ZodArray<z.ZodObject<{
            productId: z.ZodNumber;
            quantity: z.ZodNumber;
            discount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            addonIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
            addons: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodNumber;
                qty: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getTransactionByIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getTransactionsQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        startDate: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodString>]>;
        endDate: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodString>]>;
        userId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        paymentMethodId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        search: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=transaction.validation.d.ts.map