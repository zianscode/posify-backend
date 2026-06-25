export declare class DashboardService {
    /**
     * Get macro dashboard stats: total revenue, transactions count, catalog size, low stock count.
     */
    getSummary(startDate?: string, endDate?: string, outletId?: number): Promise<{
        totalRevenue: number;
        totalTransactions: number;
        totalProducts: number;
        lowStockCount: number;
    }>;
    /**
     * Get daily sales trend (revenue and transactions count)
     */
    getSalesTrend(days: number, startDate?: string, endDate?: string, outletId?: number): Promise<any[]>;
    /**
     * Get best selling products ranked by quantity sold
     */
    getTopProducts(limit: number, startDate?: string, endDate?: string, outletId?: number): Promise<any[]>;
}
//# sourceMappingURL=dashboard.service.d.ts.map