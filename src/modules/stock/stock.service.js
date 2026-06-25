"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockService = void 0;
const database_1 = require("../../config/database");
const errors_1 = require("../../shared/errors");
class StockService {
    /**
     * Adjust stock manually for a product (IN/OUT)
     */
    async adjustStock(userId, data) {
        const { productId, quantity, type, description } = data;
        // 1. Fetch product to verify existence and check current stock
        const product = await database_1.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new errors_1.NotFoundError("Produk tidak ditemukan");
        }
        // 2. Validate stock availability for OUT adjustment
        if (type === "OUT" && product.stock < quantity) {
            throw new errors_1.BadRequestError(`Stok tidak mencukupi untuk penyesuaian keluar. Stok saat ini: ${product.stock}, diminta penyesuaian: ${quantity}`);
        }
        // Calculate new stock quantity
        const newStock = type === "IN" ? product.stock + quantity : product.stock - quantity;
        // 3. Perform stock update and movement log atomically
        return database_1.prisma.$transaction(async (tx) => {
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
    async getStockMovements(productId) {
        // Check if product exists first
        const product = await database_1.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new errors_1.NotFoundError("Produk tidak ditemukan");
        }
        return database_1.prisma.stockMovement.findMany({
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
exports.StockService = StockService;
//# sourceMappingURL=stock.service.js.map