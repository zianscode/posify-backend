import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";
import { sendSuccess } from "../../shared/response";

const productService = new ProductService();

export class ProductController {
  /**
   * Handle create product request
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.createProduct(req.body);

      sendSuccess({
        res,
        statusCode: 201,
        message: "Produk berhasil dibuat",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle list products request (with search, pagination, and filter)
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, categoryId, unitId, lowStock } = req.query as any;

      const { products, meta } = await productService.getProducts({
        page,
        limit,
        search,
        categoryId,
        unitId,
        lowStock,
      });

      sendSuccess({
        res,
        message: "Daftar produk berhasil diambil",
        data: products,
        meta,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle get product by ID request
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await productService.getProductById(id);

      sendSuccess({
        res,
        message: "Detail produk berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle update product request
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await productService.updateProduct(id, req.body);

      sendSuccess({
        res,
        message: "Produk berhasil diperbarui",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle delete product request
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await productService.deleteProduct(id);

      sendSuccess({
        res,
        message: "Produk berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }
}
