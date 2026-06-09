import { Request, Response, NextFunction } from "express";
import { CategoryService } from "./category.service";
import { sendSuccess } from "../../shared/response";

const categoryService = new CategoryService();

export class CategoryController {
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
}
