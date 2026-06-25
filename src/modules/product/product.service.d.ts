export interface GetProductsFilters {
    page: number;
    limit: number;
    search?: string;
    categoryId?: number;
    unitId?: number;
    lowStock?: boolean;
}
export declare class ProductService {
    /**
     * Create a new product
     */
    createProduct(data: {
        name: string;
        barcode?: string | null;
        description?: string | null;
        price: number;
        costPrice: number;
        stock?: number;
        minStock?: number;
        categoryId: number;
        unitId: number;
        image?: string | null;
    }): Promise<{
        category: {
            id: number;
            name: string;
        };
        unit: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        costPrice: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        minStock: number;
        categoryId: number;
        unitId: number;
        image: string | null;
    }>;
    /**
     * Get paginated products list with search and filters
     */
    getProducts(filters: GetProductsFilters): Promise<{
        products: ({
            category: {
                id: number;
                name: string;
            };
            unit: {
                id: number;
                name: string;
            };
        } & {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            barcode: string | null;
            description: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            stock: number;
            minStock: number;
            categoryId: number;
            unitId: number;
            image: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get product by ID
     */
    getProductById(id: number): Promise<{
        category: {
            id: number;
            name: string;
        };
        unit: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        costPrice: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        minStock: number;
        categoryId: number;
        unitId: number;
        image: string | null;
    }>;
    /**
     * Update product by ID
     */
    updateProduct(id: number, data: {
        name?: string;
        barcode?: string | null;
        description?: string | null;
        price?: number;
        costPrice?: number;
        stock?: number;
        minStock?: number;
        categoryId?: number;
        unitId?: number;
        image?: string | null;
    }): Promise<{
        category: {
            id: number;
            name: string;
        };
        unit: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        costPrice: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        minStock: number;
        categoryId: number;
        unitId: number;
        image: string | null;
    }>;
    /**
     * Delete product by ID
     */
    deleteProduct(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        barcode: string | null;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        costPrice: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        minStock: number;
        categoryId: number;
        unitId: number;
        image: string | null;
    }>;
}
//# sourceMappingURL=product.service.d.ts.map