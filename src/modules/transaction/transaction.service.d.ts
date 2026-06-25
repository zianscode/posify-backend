type AddonShape = {
    id: number;
    name: string;
    price: number;
    qty: number;
};
export interface GetTransactionsFilters {
    page: number;
    limit: number;
    startDate?: string;
    endDate?: string;
    userId?: number;
    paymentMethodId?: number;
    search?: string;
}
export declare class TransactionService {
    /**
     * Create a new POS transaction
     */
    createTransaction(userId: number, outletId: number | null, data: {
        discount?: number;
        tax?: number;
        paidAmount: number;
        paymentMethodId: number;
        items: {
            productId: number;
            quantity: number;
            discount?: number;
            addonIds?: number[];
            addons?: {
                id: number;
                qty?: number;
            }[];
        }[];
    }): Promise<{
        items: {
            addons: AddonShape[];
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
            id: number;
            price: import("@prisma/client-runtime-utils").Decimal;
            total: import("@prisma/client-runtime-utils").Decimal;
            discount: import("@prisma/client-runtime-utils").Decimal;
            productId: number;
            quantity: number;
            transactionId: number;
        }[];
        outlet?: {
            id: number;
            name: string;
            address: string | null;
            phone: string | null;
        };
        user?: {
            id: number;
            name: string;
            email: string;
        };
        paymentMethod?: {
            id: number;
            name: string;
        };
        id?: number;
        outletId?: number;
        createdAt?: Date;
        total?: import("@prisma/client-runtime-utils").Decimal;
        invoiceNo?: string;
        discount?: import("@prisma/client-runtime-utils").Decimal;
        tax?: import("@prisma/client-runtime-utils").Decimal;
        grandTotal?: import("@prisma/client-runtime-utils").Decimal;
        paidAmount?: import("@prisma/client-runtime-utils").Decimal;
        changeAmount?: import("@prisma/client-runtime-utils").Decimal;
        paymentMethodId?: number;
        userId?: number;
    }>;
    private notifyLowStock;
    /**
     * Get paginated transaction history with filters
     */
    getTransactions(filters: GetTransactionsFilters): Promise<{
        transactions: {
            items: {
                addons: AddonShape[];
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
                id: number;
                price: import("@prisma/client-runtime-utils").Decimal;
                total: import("@prisma/client-runtime-utils").Decimal;
                discount: import("@prisma/client-runtime-utils").Decimal;
                productId: number;
                quantity: number;
                transactionId: number;
            }[];
            outlet: {
                id: number;
                name: string;
                address: string | null;
                phone: string | null;
            };
            user: {
                id: number;
                name: string;
                email: string;
            };
            paymentMethod: {
                id: number;
                name: string;
            };
            id: number;
            outletId: number;
            createdAt: Date;
            total: import("@prisma/client-runtime-utils").Decimal;
            invoiceNo: string;
            discount: import("@prisma/client-runtime-utils").Decimal;
            tax: import("@prisma/client-runtime-utils").Decimal;
            grandTotal: import("@prisma/client-runtime-utils").Decimal;
            paidAmount: import("@prisma/client-runtime-utils").Decimal;
            changeAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethodId: number;
            userId: number;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get transaction detail by ID
     */
    getTransactionById(id: number): Promise<{
        items: {
            addons: AddonShape[];
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
            id: number;
            price: import("@prisma/client-runtime-utils").Decimal;
            total: import("@prisma/client-runtime-utils").Decimal;
            discount: import("@prisma/client-runtime-utils").Decimal;
            productId: number;
            quantity: number;
            transactionId: number;
        }[];
        outlet: {
            id: number;
            name: string;
            address: string | null;
            phone: string | null;
        };
        user: {
            id: number;
            name: string;
            email: string;
        };
        paymentMethod: {
            id: number;
            name: string;
        };
        id: number;
        outletId: number;
        createdAt: Date;
        total: import("@prisma/client-runtime-utils").Decimal;
        invoiceNo: string;
        discount: import("@prisma/client-runtime-utils").Decimal;
        tax: import("@prisma/client-runtime-utils").Decimal;
        grandTotal: import("@prisma/client-runtime-utils").Decimal;
        paidAmount: import("@prisma/client-runtime-utils").Decimal;
        changeAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethodId: number;
        userId: number;
    }>;
}
export {};
//# sourceMappingURL=transaction.service.d.ts.map