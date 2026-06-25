import { prisma } from "../../config/database";
import { NotFoundError, BadRequestError } from "../../shared/errors";
import { NotificationService } from "../notification/notification.service";

type AddonShape = { id: number; name: string; price: number; qty: number };

function flattenAddons(addons: { qty: number; addOn: { id: number; name: string; price: { toNumber: () => number } | number } }[]): AddonShape[] {
  return addons.map((a) => ({
    id: a.addOn.id,
    name: a.addOn.name,
    price: typeof a.addOn.price === "object" ? a.addOn.price.toNumber() : Number(a.addOn.price),
    qty: a.qty,
  }));
}

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
        addonIds?: number[];
        addons?: { id: number; qty?: number }[];
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

    // Fetch all add-ons used in this transaction to verify existence and get prices
    const itemAddonList = items.map(item => {
      if (item.addons && item.addons.length > 0) {
        return item.addons.map(a => ({ id: a.id, qty: a.qty ?? 1 }));
      } else if (item.addonIds && item.addonIds.length > 0) {
        return item.addonIds.map(id => ({ id, qty: 1 }));
      }
      return [];
    });

    const allAddonIds = Array.from(new Set(itemAddonList.flat().map(a => a.id)));
    const addonsObjList = allAddonIds.length > 0 ? await prisma.addOn.findMany({
      where: { id: { in: allAddonIds } },
    }) : [];
    const addonMap = new Map(addonsObjList.map((a) => [a.id, a]));

    // Calculate subtotal from product data and addons
    let subtotal = 0;
    const itemsData = items.map((item, idx) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new BadRequestError(`Produk dengan ID ${item.productId} tidak ditemukan`);
      }

      const price = product.price.toNumber();
      const itemDiscount = item.discount ?? 0;
      
      const resolvedAddons = itemAddonList[idx] || [];
      let addonSum = 0;
      for (const addonItem of resolvedAddons) {
        const addonObj = addonMap.get(addonItem.id);
        if (!addonObj) {
          throw new BadRequestError(`Add-on dengan ID ${addonItem.id} tidak ditemukan`);
        }
        addonSum += addonObj.price.toNumber() * addonItem.qty;
      }

      const itemTotal = (price - itemDiscount) * item.quantity + addonSum;
      subtotal += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price,
        discount: itemDiscount,
        total: itemTotal,
        addons: resolvedAddons,
      };
    });

    // 3. Pricing calculations (tax is calculated after applying discount)
    const discountAmount = discount;
    const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
    const taxAmount = subtotalAfterDiscount * (tax / 100);
    const grandTotal = subtotalAfterDiscount + taxAmount;
    const changeAmount = paidAmount - grandTotal;

    if (paidAmount < grandTotal) {
      throw new BadRequestError(
        `Pembayaran kurang dari total belanja. Total: ${grandTotal}, Dibayar: ${paidAmount}`
      );
    }

    // 4. Atomically insert transaction, items, update stocks and write movements logs
    const transactionId = await prisma.$transaction(async (tx) => {
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

      // Create transaction record with items
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
          items: true,
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

      // Save addon relations for each item
      for (let i = 0; i < itemsData.length; i++) {
        const item = itemsData[i]!;
        if (item.addons.length) {
          const createdItem = transaction.items[i]!;
          await tx.transactionItemAddOn.createMany({
            data: item.addons.map((addon) => ({
              transactionItemId: createdItem.id,
              addOnId: addon.id,
              qty: addon.qty,
            })),
          });
        }
      }

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

      return transaction.id;
    });

    // Fetch complete transaction with addon data
    const result = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        items: {
          include: {
            product: true,
            addons: {
              include: {
                addOn: true,
              },
            },
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

    // Create notifications after successful transaction
    await notificationService.create({
      type: "NEW_TRANSACTION",
      title: "Transaksi Baru",
      message: `Transaksi ${result!.invoiceNo} sebesar Rp ${Number(result!.grandTotal).toLocaleString("id-ID")}`,
      link: `/history`,
      outletId,
    });

    // Check low stock for each product
    await this.notifyLowStock(outletId, itemsData);

    return {
      ...result,
      items: result!.items.map((item) => ({
        ...item,
        addons: flattenAddons(item.addons as any),
      })),
    };
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
              addons: {
                include: {
                  addOn: true,
                },
              },
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
      transactions: transactions.map((t) => ({
        ...t,
        items: t.items.map((item) => ({
          ...item,
          addons: flattenAddons(item.addons as any),
        })),
      })),
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
            addons: {
              include: {
                addOn: true,
              },
            },
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

    return {
      ...transaction,
      items: transaction.items.map((item) => ({
        ...item,
        addons: flattenAddons(item.addons as any),
      })),
    };
  }
}
