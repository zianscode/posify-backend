export declare class StockService {
    /**
     * Adjust stock manually for a product (IN/OUT)
     */
    adjustStock(userId: number, data: {
        productId: number;
        quantity: number;
        type: "IN" | "OUT";
        description?: string | null;
    }): Promise<{
        product: {
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
        };
        movement: {
            id: number;
            createdAt: Date;
            description: string | null;
            type: import("../../generated/prisma").$Enums.StockMovementType;
            userId: number | null;
            productId: number;
            quantity: number;
        };
    }>;
    /**
     * Get all stock movements for a specific product
     */
    getStockMovements(productId: number): Promise<({
        user: {
            role: {
                name: string;
            };
            id: number;
            name: string;
            email: string;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        description: string | null;
        type: import("../../generated/prisma").$Enums.StockMovementType;
        userId: number | null;
        productId: number;
        quantity: number;
    })[]>;
}
//# sourceMappingURL=stock.service.d.ts.map