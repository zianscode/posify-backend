import { prisma } from "../../config/database";
import { NotFoundError, BadRequestError } from "../../shared/errors";
import { NotificationService } from "../notification/notification.service";

export interface GetTransactionsFilters {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
  userId?: number;
  paymentMethodId?: number;
  search?: string;
}

const notificationService = new NotificationService();

export class TransactionService {
  /**
   * Create a new POS transaction
   */
  async createTransaction(
    userId: number,
    outletId: number | null,
    data: {
      discount?: number;
      tax?: number;
      paidAmount: number;
      paymentMethodId: number;
      items: {
        productId: number;
        quantity: number;
        discount?: number;
      }[];
    }
  ) {
    // 1. Verify user is assigned to an outlet
    if (!outletId) {
      throw new BadRequestError("Pengguna tidak dikaitkan dengan outlet mana pun");
    }

    const { discount = 0, tax = 0, paidAmount, paymentMethodId, items } = data;

    // 2. Fetch all products to verify existence
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Calculate subtotal from product data (stock check done inside transaction)
    let subtotal = 0;
    const itemsData = items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new BadRequestError(`Produk dengan ID ${item.productId} tidak ditemukan`);
      }

      const price = product.price.toNumber();
      const itemDiscount = item.discount ?? 0;
      const itemTotal = (price - itemDiscount) * item.quantity;
      subtotal += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price,
        discount: itemDiscount,
        total: itemTotal,
      };
    });

    // 3. Pricing calculations
    const taxAmount = subtotal * (tax / 100);
    const discountAmount = discount;
    const grandTotal = Math.max(0, subtotal + taxAmount - discountAmount);
    const changeAmount = paidAmount - grandTotal;

    if (paidAmount < grandTotal) {
      throw new BadRequestError(
        `Pembayaran kurang dari total belanja. Total: ${grandTotal}, Dibayar: ${paidAmount}`
      );
    }

    // 4. Atomically insert transaction, items, update stocks and write movements logs
    const transaction = await prisma.$transaction(async (tx) => {
      // Verify payment method exists
      const paymentMethod = await tx.paymentMethod.findUnique({
        where: { id: paymentMethodId },
      });
      if (!paymentMethod) {
        throw new BadRequestError("Metode pembayaran tidak ditemukan");
      }

      // Generate invoice number YYYYMMDD + sequence
      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const count = await tx.transaction.count({
        where: {
          invoiceNo: {
            startsWith: `INV-${todayStr}-`,
          },
        },
      });

      const nextSeq = String(count + 1).padStart(4, "0");
      const invoiceNo = `INV-${todayStr}-${nextSeq}`;

      // Re-validate stock inside transaction (prevents race condition)
      for (const item of itemsData) {
        const currentProduct = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true, name: true },
        });
        if (!currentProduct) {
          throw new BadRequestError(`Produk dengan ID ${item.productId} tidak ditemukan`);
        }
        if (currentProduct.stock < item.quantity) {
          throw new BadRequestError(
            `Stok produk "${currentProduct.name}" tidak mencukupi. Stok saat ini: ${currentProduct.stock}, diminta: ${item.quantity}`
          );
        }
      }

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          invoiceNo,
          total: subtotal,
          discount: discountAmount,
          tax: taxAmount,
          grandTotal,
          paidAmount,
          changeAmount,
          paymentMethodId,
          outletId,
          userId,
          items: {
            create: itemsData.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              discount: item.discount,
              total: item.total,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          paymentMethod: true,
          outlet: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Update product stocks and add stock movements logs
      for (const item of itemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            quantity: item.quantity,
            type: "OUT",
            description: `Transaksi POS - ${invoiceNo}`,
            userId,
          },
        });
      }

      return transaction;
    });

    // Create notifications after successful transaction
    await notificationService.create({
      type: "NEW_TRANSACTION",
      title: "Transaksi Baru",
      message: `Transaksi ${transaction.invoiceNo} sebesar Rp ${Number(transaction.grandTotal).toLocaleString("id-ID")}`,
      link: `/history`,
      outletId,
    });

    // Check low stock for each product
    await this.notifyLowStock(outletId, itemsData);

    return transaction;
  }

  private async notifyLowStock(outletId: number, itemsData: any[]) {
    const productIds = itemsData.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    for (const product of products) {
      if (product.stock <= product.minStock) {
        await notificationService.create({
          type: "STOCK_ALERT",
          title: "Stok Menipis",
          message: `Stok "${product.name}" tersisa ${product.stock} dari minimum ${product.minStock}`,
          link: `/stock`,
          outletId,
        });
      }
    }
  }

  /**
   * Get paginated transaction history with filters
   */
  async getTransactions(filters: GetTransactionsFilters) {
    const { page, limit, startDate, endDate, userId, paymentMethodId, search } = filters;
    const skip = (page - 1) * limit;
    const take = limit;

    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (paymentMethodId) {
      where.paymentMethodId = paymentMethodId;
    }

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

    if (search) {
      where.OR = [
        { invoiceNo: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take,
        include: {
          items: {
            include: {
              product: true,
            },
          },
          paymentMethod: true,
          outlet: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      transactions,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get transaction detail by ID
   */
  async getTransactionById(id: number) {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        paymentMethod: true,
        outlet: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundError("Transaksi tidak ditemukan");
    }

    return transaction;
  }
}
