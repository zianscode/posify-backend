import { Prisma } from "../../generated/prisma";
import { prisma } from "../../config/database";

export class DashboardService {
  /**
   * Get macro dashboard stats: total revenue, transactions count, catalog size, low stock count.
   */
  async getSummary(startDate?: string, endDate?: string, outletId?: number) {
    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const endOfDate = new Date(endDate);
        endOfDate.setHours(23, 59, 59, 999);
        where.createdAt.lte = endOfDate;
      }
    }

    if (outletId) {
      where.outletId = outletId;
    }

    const [revenueAgg, transactionCount, totalProducts] = await Promise.all([
      prisma.transaction.aggregate({
        _sum: {
          grandTotal: true,
        },
        where,
      }),
      prisma.transaction.count({ where }),
      prisma.product.count(),
    ]);

    // Count low stock products where stock <= min_stock
    const lowStockResult = await prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*)::int as count FROM products WHERE stock <= min_stock
    `;
    const lowStockCount = lowStockResult[0]?.count || 0;

    return {
      totalRevenue: Number(revenueAgg._sum.grandTotal || 0),
      totalTransactions: transactionCount,
      totalProducts,
      lowStockCount,
    };
  }

  /**
   * Get daily sales trend (revenue and transactions count)
   */
  async getSalesTrend(days: number, startDate?: string, endDate?: string, outletId?: number) {
    let start: Date;
    let end: Date;

    if (startDate || endDate) {
      start = startDate ? new Date(startDate) : new Date(0);
      end = endDate ? new Date(endDate) : new Date();
      if (endDate) {
        end.setHours(23, 59, 59, 999);
      }
    } else {
      start = new Date();
      start.setDate(start.getDate() - (days - 1));
      start.setHours(0, 0, 0, 0);
      end = new Date();
    }

    // Query daily sales trend
    const trend = await prisma.$queryRaw<any[]>`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM-DD') as date, 
        SUM(grand_total)::float as revenue, 
        COUNT(*)::int as transactions
      FROM transactions
      WHERE created_at >= ${start} AND created_at <= ${end}
      ${outletId ? Prisma.sql`AND outlet_id = ${outletId}` : Prisma.empty}
      GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
      ORDER BY date ASC
    `;

    return trend;
  }

  /**
   * Get best selling products ranked by quantity sold
   */
  async getTopProducts(limit: number, startDate?: string, endDate?: string, outletId?: number) {
    let start = startDate ? new Date(startDate) : new Date(0);
    let end = endDate ? new Date(endDate) : new Date();
    if (endDate) {
      end.setHours(23, 59, 59, 999);
    }

    // Query top products joining transaction_items and products
    const topProducts = await prisma.$queryRaw<any[]>`
      SELECT 
        ti.product_id as "productId", 
        p.name as "productName", 
        p.barcode as "productBarcode",
        SUM(ti.quantity)::float as "quantitySold", 
        SUM(ti.total)::float as "totalRevenue"
      FROM transaction_items ti
      JOIN products p ON ti.product_id = p.id
      JOIN transactions t ON ti.transaction_id = t.id
      WHERE t.created_at >= ${start} AND t.created_at <= ${end}
      ${outletId ? Prisma.sql`AND t.outlet_id = ${outletId}` : Prisma.empty}
      GROUP BY ti.product_id, p.name, p.barcode
      ORDER BY "quantitySold" DESC
      LIMIT ${limit}
    `;

    return topProducts;
  }
}
