"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("./product.service");
const response_1 = require("../../shared/response");
const productService = new product_service_1.ProductService();
class ProductController {
    /**
     * Handle create product request
     */
    async create(req, res, next) {
        try {
            const data = { ...req.body };
            if (req.file) {
                data.image = `products/${req.file.filename}`;
            }
            const result = await productService.createProduct(data);
            (0, response_1.sendSuccess)({
                res,
                statusCode: 201,
                message: "Produk berhasil dibuat",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Handle list products request (with search, pagination, and filter)
     */
    async list(req, res, next) {
        try {
            const { page, limit, search, categoryId, unitId, lowStock } = req.query;
            const { products, meta } = await productService.getProducts({
                page,
                limit,
                search,
                categoryId,
                unitId,
                lowStock,
            });
            (0, response_1.sendSuccess)({
                res,
                message: "Daftar produk berhasil diambil",
                data: products,
                meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Handle get product by ID request
     */
    async getById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const result = await productService.getProductById(id);
            (0, response_1.sendSuccess)({
                res,
                message: "Detail produk berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Handle update product request
     */
    async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const data = { ...req.body };
            if (req.file) {
                data.image = `products/${req.file.filename}`;
            }
            const result = await productService.updateProduct(id, data);
            (0, response_1.sendSuccess)({
                res,
                message: "Produk berhasil diperbarui",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Handle delete product request
     */
    async delete(req, res, next) {
        try {
            const id = Number(req.params.id);
            await productService.deleteProduct(id);
            (0, response_1.sendSuccess)({
                res,
                message: "Produk berhasil dihapus",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map