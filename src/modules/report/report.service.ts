import { prisma } from "../../config/database";
import { toCSV } from "../../shared/csv";

export class ReportService {
  async getSalesReport(startDate?: string, endDate?: string) {
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

    const [revenueAgg, transactionCount, totalDiscount, totalTax, transactions] =
      await Promise.all([
        prisma.transaction.aggregate({
          _sum: { grandTotal: true },
          where,
        }),
        prisma.transaction.count({ where }),
        prisma.transaction.aggregate({
          _sum: { discount: true },
          where,
        }),
        prisma.transaction.aggregate({
          _sum: { tax: true },
          where,
        }),
        prisma.transaction.findMany({
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

  getSalesCSV(summary: {
    totalRevenue: number;
    totalTransactions: number;
    totalDiscount: number;
    totalTax: number;
  }, transactions: any[]): string {
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
    const detailRows = transactions.map((t: any) => [
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

    return (
      `LAPORAN PENJUALAN\r\n\r\n` +
      toCSV(summaryHeaders, summaryRows) +
      `\r\n\r\nDETAIL TRANSAKSI\r\n\r\n` +
      toCSV(detailHeaders, detailRows)
    );
  }

  async getProductReport(limit: number, startDate?: string, endDate?: string) {
    let start = startDate ? new Date(startDate) : new Date(0);
    let end = endDate ? new Date(endDate) : new Date();
    if (endDate) {
      end.setHours(23, 59, 59, 999);
    }

    const products = await prisma.$queryRaw<any[]>`
      SELECT
        p.id as "productId",
        p.name as "productName",
        p.barcode as "productBarcode",
        p.price as "productPrice",
        p.stock as "currentStock",
        COALESCE(SUM(ti.quantity), 0)::float as "quantitySold",
        COALESCE(SUM(ti.total), 0)::float as "totalRevenue"
      FROM products p
      LEFT JOIN transaction_items ti ON ti.product_id = p.id
      LEFT JOIN transactions t ON ti.transaction_id = t.id
        AND t.created_at >= ${start}
        AND t.created_at <= ${end}
      GROUP BY p.id, p.name, p.barcode, p.price, p.stock
      ORDER BY "quantitySold" DESC
      LIMIT ${limit}
    `;

    return products;
  }

  getProductCSV(products: any[]): string {
    const headers = [
      "ID", "Nama Produk", "Barcode", "Harga",
      "Stok Saat Ini", "Terjual", "Total Pendapatan",
    ];
    const rows = products.map((p: any) => [
      p.productId,
      p.productName,
      p.productBarcode ?? "-",
      Number(p.productPrice),
      p.currentStock,
      p.quantitySold,
      p.totalRevenue,
    ]);

    return `LAPORAN PRODUK\r\n\r\n` + toCSV(headers, rows);
  }

  async getStockReport() {
    const products = await prisma.product.findMany({
      where: {
        stock: { lte: prisma.product.fields.minStock },
      },
      include: {
        category: true,
        unit: true,
      },
      orderBy: {
        stock: "asc",
      },
    });

    const totalProducts = await prisma.product.count();
    const totalStockValue = await prisma.product.aggregate({
      _sum: { stock: true },
      where: { stock: { gt: 0 } },
    });

    return {
      summary: {
        totalProducts,
        lowStockCount: products.length,
        totalStockQuantity: Number(totalStockValue._sum.stock || 0),
      },
      products,
    };
  }

  getStockCSV(summary: {
    totalProducts: number;
    lowStockCount: number;
    totalStockQuantity: number;
  }, products: any[]): string {
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
    const detailRows = products.map((p: any) => [
      p.id,
      p.name,
      p.barcode ?? "-",
      p.stock,
      p.minStock,
      p.category?.name ?? "-",
      p.unit?.name ?? "-",
    ]);

    return (
      `LAPORAN STOK\r\n\r\n` +
      toCSV(summaryHeaders, summaryRows) +
      `\r\n\r\nPRODUK DENGAN STOK MENIPIS\r\n\r\n` +
      toCSV(detailHeaders, detailRows)
    );
  }
}
