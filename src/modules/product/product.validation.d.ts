import { z } from "zod";
export declare const createProductSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        barcode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        price: z.ZodNumber;
        costPrice: z.ZodNumber;
        stock: z.ZodDefault<z.ZodNumber>;
        minStock: z.ZodDefault<z.ZodNumber>;
        categoryId: z.ZodNumber;
        unitId: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateProductSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        barcode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        price: z.ZodOptional<z.ZodNumber>;
        costPrice: z.ZodOptional<z.ZodNumber>;
        stock: z.ZodOptional<z.ZodNumber>;
        minStock: z.ZodOptional<z.ZodNumber>;
        categoryId: z.ZodOptional<z.ZodNumber>;
        unitId: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getProductByIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getProductsQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        search: z.ZodOptional<z.ZodString>;
        categoryId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        unitId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        lowStock: z.ZodOptional<z.ZodPreprocess<z.ZodBoolean>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=product.validation.d.ts.map