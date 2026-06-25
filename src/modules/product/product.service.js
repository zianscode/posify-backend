"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const database_1 = require("../../config/database");
const errors_1 = require("../../shared/errors");
const upload_1 = require("../../config/upload");
class ProductService {
    /**
     * Create a new product
     */
    async createProduct(data) {
        // 1. Check if category exists
        const category = await database_1.prisma.category.findUnique({
            where: { id: data.categoryId },
        });
        if (!category) {
            throw new errors_1.BadRequestError("Kategori tidak ditemukan");
        }
        // 2. Check if unit exists
        const unit = await database_1.prisma.unit.findUnique({
            where: { id: data.unitId },
        });
        if (!unit) {
            throw new errors_1.BadRequestError("Unit tidak ditemukan");
        }
        // 3. Check barcode uniqueness if provided
        if (data.barcode) {
            const existingBarcode = await database_1.prisma.product.findUnique({
                where: { barcode: data.barcode },
            });
            if (existingBarcode) {
                throw new errors_1.BadRequestError("Barcode sudah digunakan oleh produk lain");
            }
        }
        return database_1.prisma.product.create({
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
                image: data.image ?? null,
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
    async getProducts(filters) {
        const { page, limit, search, categoryId, unitId, lowStock } = filters;
        const skip = (page - 1) * limit;
        const take = limit;
        const where = {};
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
            const lowStockProducts = await database_1.prisma.$queryRaw `
        SELECT id FROM products WHERE stock <= min_stock
      `;
            const lowStockIds = lowStockProducts.map((p) => p.id);
            where.id = { in: lowStockIds };
        }
        const [products, total] = await Promise.all([
            database_1.prisma.product.findMany({
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
            database_1.prisma.product.count({ where }),
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
    async getProductById(id) {
        const product = await database_1.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                unit: true,
            },
        });
        if (!product) {
            throw new errors_1.NotFoundError("Produk tidak ditemukan");
        }
        return product;
    }
    /**
     * Update product by ID
     */
    async updateProduct(id, data) {
        // 1. Check if product exists
        const existing = await this.getProductById(id);
        // 2. Validate category if updated
        if (data.categoryId) {
            const category = await database_1.prisma.category.findUnique({
                where: { id: data.categoryId },
            });
            if (!category) {
                throw new errors_1.BadRequestError("Kategori tidak ditemukan");
            }
        }
        // 3. Validate unit if updated
        if (data.unitId) {
            const unit = await database_1.prisma.unit.findUnique({
                where: { id: data.unitId },
            });
            if (!unit) {
                throw new errors_1.BadRequestError("Unit tidak ditemukan");
            }
        }
        // 4. Validate barcode uniqueness if updated
        if (data.barcode) {
            const existingBarcode = await database_1.prisma.product.findFirst({
                where: {
                    barcode: data.barcode,
                    NOT: { id },
                },
            });
            if (existingBarcode) {
                throw new errors_1.BadRequestError("Barcode sudah digunakan oleh produk lain");
            }
        }
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.barcode !== undefined)
            updateData.barcode = data.barcode;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.price !== undefined)
            updateData.price = data.price;
        if (data.costPrice !== undefined)
            updateData.costPrice = data.costPrice;
        if (data.stock !== undefined)
            updateData.stock = data.stock;
        if (data.minStock !== undefined)
            updateData.minStock = data.minStock;
        if (data.categoryId !== undefined)
            updateData.categoryId = data.categoryId;
        if (data.unitId !== undefined)
            updateData.unitId = data.unitId;
        if (data.image !== undefined)
            updateData.image = data.image;
        // Delete old image if a new one is provided
        if (data.image && existing.image) {
            (0, upload_1.deleteImage)(existing.image);
        }
        return database_1.prisma.product.update({
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
    async deleteProduct(id) {
        // 1. Check if product exists
        const product = await this.getProductById(id);
        // 3. Check if product is associated with transaction items
        const transactionItemCount = await database_1.prisma.transactionItem.count({
            where: { productId: id },
        });
        if (transactionItemCount > 0) {
            throw new errors_1.BadRequestError("Produk tidak dapat dihapus karena sudah memiliki riwayat transaksi");
        }
        // 4. Delete product image file if exists
        if (product.image) {
            (0, upload_1.deleteImage)(product.image);
        }
        return database_1.prisma.product.delete({
            where: { id },
        });
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map