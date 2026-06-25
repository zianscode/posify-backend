export declare class ReportService {
    getSalesReport(startDate?: string, endDate?: string): Promise<{
        summary: {
            totalRevenue: number;
            totalTransactions: number;
            totalDiscount: number;
            totalTax: number;
        };
        transactions: ({
            outlet: {
                id: number;
                name: string;
                address: string | null;
                phone: string | null;
            };
            user: {
                id: number;
                name: string;
            };
            paymentMethod: {
                id: number;
                name: string;
            };
        } & {
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
        })[];
    }>;
    getSalesCSV(summary: {
        totalRevenue: number;
        totalTransactions: number;
        totalDiscount: number;
        totalTax: number;
    }, transactions: any[]): string;
    getProductReport(limit: number, startDate?: string, endDate?: string): Promise<any[]>;
    getProductCSV(products: any[]): string;
    getStockReport(): Promise<{
        summary: {
            totalProducts: number;
            lowStockCount: number;
            totalStockQuantity: number;
        };
        products: any[];
    }>;
    getStockCSV(summary: {
        totalProducts: number;
        lowStockCount: number;
        totalStockQuantity: number;
    }, products: any[]): string;
}
//# sourceMappingURL=report.service.d.ts.map