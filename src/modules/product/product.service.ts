import { prisma } from "../../config/database";
import { NotFoundError, BadRequestError } from "../../shared/errors";

export interface GetProductsFilters {
  page: number;
  limit: number;
  search?: string;
  categoryId?: number;
  unitId?: number;
  lowStock?: boolean;
}

export class ProductService {
  /**
   * Create a new product
   */
  async createProduct(data: {
    name: string;
    barcode?: string | null;
    description?: string | null;
    price: number;
    costPrice: number;
    stock?: number;
    minStock?: number;
    categoryId: number;
    unitId: number;
  }) {
    // 1. Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      throw new BadRequestError("Kategori tidak ditemukan");
    }

    // 2. Check if unit exists
    const unit = await prisma.unit.findUnique({
      where: { id: data.unitId },
    });
    if (!unit) {
      throw new BadRequestError("Unit tidak ditemukan");
    }

    // 3. Check barcode uniqueness if provided
    if (data.barcode) {
      const existingBarcode = await prisma.product.findUnique({
        where: { barcode: data.barcode },
      });
      if (existingBarcode) {
        throw new BadRequestError("Barcode sudah digunakan oleh produk lain");
      }
    }

    return prisma.product.create({
      data: {
        name: data.name,
        barcode: data.barcode ?? null,
        description: data.description ?? null,
        price: data.price,
        costPrice: data.costPrice,
        stock: data.stock ?? 0,
        minStock: data.minStock ?? 0,
        categoryId: data.categoryId,
        unitId: data.unitId,
      },
      include: {
        category: true,
        unit: true,
      },
    });
  }

  /**
   * Get paginated products list with search and filters
   */
  async getProducts(filters: GetProductsFilters) {
    const { page, limit, search, categoryId, unitId, lowStock } = filters;
    const skip = (page - 1) * limit;
    const take = limit;

    const where: any = {};

    // Filter by category
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Filter by unit
    if (unitId) {
      where.unitId = unitId;
    }

    // Search by name or barcode
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { barcode: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter by low stock (stock <= min_stock)
    if (lowStock) {
      const lowStockProducts = await prisma.$queryRaw<{ id: number }[]>`
        SELECT id FROM products WHERE stock <= min_stock
      `;
      const lowStockIds = lowStockProducts.map((p) => p.id);
      where.id = { in: lowStockIds };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        include: {
          category: true,
          unit: true,
        },
        orderBy: {
          id: "desc",
        },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      products,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get product by ID
   */
  async getProductById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        unit: true,
      },
    });

    if (!product) {
      throw new NotFoundError("Produk tidak ditemukan");
    }

    return product;
  }

  /**
   * Update product by ID
   */
  async updateProduct(
    id: number,
    data: {
      name?: string;
      barcode?: string | null;
      description?: string | null;
      price?: number;
      costPrice?: number;
      stock?: number;
      minStock?: number;
      categoryId?: number;
      unitId?: number;
    }
  ) {
    // 1. Check if product exists
    await this.getProductById(id);

    // 2. Validate category if updated
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new BadRequestError("Kategori tidak ditemukan");
      }
    }

    // 3. Validate unit if updated
    if (data.unitId) {
      const unit = await prisma.unit.findUnique({
        where: { id: data.unitId },
      });
      if (!unit) {
        throw new BadRequestError("Unit tidak ditemukan");
      }
    }

    // 4. Validate barcode uniqueness if updated
    if (data.barcode) {
      const existingBarcode = await prisma.product.findFirst({
        where: {
          barcode: data.barcode,
          NOT: { id },
        },
      });
      if (existingBarcode) {
        throw new BadRequestError("Barcode sudah digunakan oleh produk lain");
      }
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.barcode !== undefined) updateData.barcode = data.barcode;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.costPrice !== undefined) updateData.costPrice = data.costPrice;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.minStock !== undefined) updateData.minStock = data.minStock;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.unitId !== undefined) updateData.unitId = data.unitId;

    return prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        unit: true,
      },
    });
  }

  /**
   * Delete product by ID
   */
  async deleteProduct(id: number) {
    // 1. Check if product exists
    await this.getProductById(id);

    // 2. Check if product is associated with transaction items
    const transactionItemCount = await prisma.transactionItem.count({
      where: { productId: id },
    });

    if (transactionItemCount > 0) {
      throw new BadRequestError(
        "Produk tidak dapat dihapus karena sudah memiliki riwayat transaksi"
      );
    }

    return prisma.product.delete({
      where: { id },
    });
  }
}
