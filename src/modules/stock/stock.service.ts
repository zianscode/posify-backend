import { prisma } from "../../config/database";
import { NotFoundError, BadRequestError } from "../../shared/errors";

export class StockService {
  /**
   * Adjust stock manually for a product (IN/OUT)
   */
  async adjustStock(
    userId: number,
    data: {
      productId: number;
      quantity: number;
      type: "IN" | "OUT";
      description?: string | null;
    }
  ) {
    const { productId, quantity, type, description } = data;

    // 1. Fetch product to verify existence and check current stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError("Produk tidak ditemukan");
    }

    // 2. Validate stock availability for OUT adjustment
    if (type === "OUT" && product.stock < quantity) {
      throw new BadRequestError(
        `Stok tidak mencukupi untuk penyesuaian keluar. Stok saat ini: ${product.stock}, diminta penyesuaian: ${quantity}`
      );
    }

    // Calculate new stock quantity
    const newStock = type === "IN" ? product.stock + quantity : product.stock - quantity;

    // 3. Perform stock update and movement log atomically
    return prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });

      const movement = await tx.stockMovement.create({
        data: {
          productId,
          quantity,
          type,
          description: description ?? null,
          userId,
        },
      });

      return {
        product: updatedProduct,
        movement,
      };
    });
  }

  /**
   * Get all stock movements for a specific product
   */
  async getStockMovements(productId: number) {
    // Check if product exists first
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError("Produk tidak ditemukan");
    }

    return prisma.stockMovement.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
