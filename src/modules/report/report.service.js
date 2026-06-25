"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const database_1 = require("../../config/database");
const csv_1 = require("../../shared/csv");
class ReportService {
    async getSalesReport(startDate, endDate) {
        const where = {};
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
        const [revenueAgg, transactionCount, totalDiscount, totalTax, transactions] = await Promise.all([
            database_1.prisma.transaction.aggregate({
                _sum: { grandTotal: true },
                where,
            }),
            database_1.prisma.transaction.count({ where }),
            database_1.prisma.transaction.aggregate({
                _sum: { discount: true },
                where,
            }),
            database_1.prisma.transaction.aggregate({
                _sum: { tax: true },
                where,
            }),
            database_1.prisma.transaction.findMany({
                where,
                include: {
                    paymentMethod: true,
                    user: { select: { id: true, name: true } },
                    outlet: true,
                },
                orderBy: { createdAt: "desc" },
            }),
        ]);
        const summary = {
            totalRevenue: Number(revenueAgg._sum.grandTotal || 0),
            totalTransactions: transactionCount,
            totalDiscount: Number(totalDiscount._sum.discount || 0),
            totalTax: Number(totalTax._sum.tax || 0),
        };
        return { summary, transactions };
    }
    getSalesCSV(summary, transactions) {
        const summaryHeaders = ["Metrik", "Nilai"];
        const summaryRows = [
            ["Total Pendapatan", summary.totalRevenue],
            ["Total Transaksi", summary.totalTransactions],
            ["Total Diskon", summary.totalDiscount],
            ["Total Pajak", summary.totalTax],
        ];
        const detailHeaders = [
            "No. Invoice", "Tanggal", "Total", "Diskon", "Pajak",
            "Grand Total", "Metode Bayar", "Outlet", "Kasir",
        ];
        const detailRows = transactions.map((t) => [
            t.invoiceNo,
            t.createdAt.toISOString().slice(0, 19).replace("T", " "),
            Number(t.total),
            Number(t.discount),
            Number(t.tax),
            Number(t.grandTotal),
            t.paymentMethod?.name ?? "-",
            t.outlet?.name ?? "-",
            t.user?.name ?? "-",
        ]);
        return (`LAPORAN PENJUALAN\r\n\r\n` +
            (0, csv_1.toCSV)(summaryHeaders, summaryRows) +
            `\r\n\r\nDETAIL TRANSAKSI\r\n\r\n` +
            (0, csv_1.toCSV)(detailHeaders, detailRows));
    }
    async getProductReport(limit, startDate, endDate) {
        let start = startDate ? new Date(startDate) : new Date(0);
        let end = endDate ? new Date(endDate) : new Date();
        if (endDate) {
            end.setHours(23, 59, 59, 999);
        }
        const products = await database_1.prisma.$queryRaw `
      SELECT
        p.id as "productId",
        p.name as "productName",
        p.barcode as "productBarcode",
        p.price as "productPrice",
        p.stock as "currentStock",
        COALESCE(SUM(ti.quantity), 0)::float as "quantitySold",
        COALESCE(SUM(ti.total), 0)::float as "totalRevenue"
      FROM products p
      LEFT JOIN (
        SELECT ti.* FROM transaction_items ti
        JOIN transactions t ON ti.transaction_id = t.id
          AND t.created_at >= ${start}
          AND t.created_at <= ${end}
      ) ti ON ti.product_id = p.id
      GROUP BY p.id, p.name, p.barcode, p.price, p.stock
      ORDER BY "quantitySold" DESC
      LIMIT ${limit}
    `;
        return products;
    }
    getProductCSV(products) {
        const headers = [
            "ID", "Nama Produk", "Barcode", "Harga",
            "Stok Saat Ini", "Terjual", "Total Pendapatan",
        ];
        const rows = products.map((p) => [
            p.productId,
            p.productName,
            p.productBarcode ?? "-",
            Number(p.productPrice),
            p.currentStock,
            p.quantitySold,
            p.totalRevenue,
        ]);
        return `LAPORAN PRODUK\r\n\r\n` + (0, csv_1.toCSV)(headers, rows);
    }
    async getStockReport() {
        const [products, totalProducts, totalStockValue] = await Promise.all([
            database_1.prisma.$queryRaw `
        SELECT p.*, c.name as "categoryName", u.name as "unitName"
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        LEFT JOIN units u ON u.id = p.unit_id
        WHERE p.stock <= p.min_stock
        ORDER BY p.stock ASC
      `,
            database_1.prisma.product.count(),
            database_1.prisma.product.aggregate({
                _sum: { stock: true },
                where: { stock: { gt: 0 } },
            }),
        ]);
        return {
            summary: {
                totalProducts,
                lowStockCount: products.length,
                totalStockQuantity: Number(totalStockValue._sum.stock || 0),
            },
            products,
        };
    }
    getStockCSV(summary, products) {
        const summaryHeaders = ["Metrik", "Nilai"];
        const summaryRows = [
            ["Total Produk", summary.totalProducts],
            ["Produk Stok Menipis", summary.lowStockCount],
            ["Total Kuantitas Stok", summary.totalStockQuantity],
        ];
        const detailHeaders = [
            "ID", "Nama Produk", "Barcode", "Stok",
            "Min Stok", "Kategori", "Satuan",
        ];
        const detailRows = products.map((p) => [
            p.id,
            p.name,
            p.barcode ?? "-",
            p.stock,
            p.minStock,
            p.categoryName ?? "-",
            p.unitName ?? "-",
        ]);
        return (`LAPORAN STOK\r\n\r\n` +
            (0, csv_1.toCSV)(summaryHeaders, summaryRows) +
            `\r\n\r\nPRODUK DENGAN STOK MENIPIS\r\n\r\n` +
            (0, csv_1.toCSV)(detailHeaders, detailRows));
    }
}
exports.ReportService = ReportService;
//# sourceMappingURL=report.service.js.map