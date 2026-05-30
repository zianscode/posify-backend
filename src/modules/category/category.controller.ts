import { Request, Response, NextFunction } from "express";
import { CategoryService } from "./category.service";
import { sendSuccess } from "../../shared/response";

const categoryService = new CategoryService();

export class CategoryController {
  /**
   * Handle create category request
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const result = await categoryService.createCategory(name);

      sendSuccess({
        res,
        statusCode: 201,
        message: "Kategori berhasil dibuat",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle list categories request
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await categoryService.getCategories();

      sendSuccess({
        res,
        message: "Daftar kategori berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle get category by ID request
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await categoryService.getCategoryById(id);

      sendSuccess({
        res,
        message: "Detail kategori berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle update category request
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { name } = req.body;
      const result = await categoryService.updateCategory(id, name);

      sendSuccess({
        res,
        message: "Kategori berhasil diperbarui",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle delete category request
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await categoryService.deleteCategory(id);

      sendSuccess({
        res,
        message: "Kategori berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }
}
