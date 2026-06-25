"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = require("./category.service");
const response_1 = require("../../shared/response");
const categoryService = new category_service_1.CategoryService();
class CategoryController {
    async list(req, res, next) {
        try {
            const result = await categoryService.getCategories();
            (0, response_1.sendSuccess)({
                res,
                message: "Daftar kategori berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const result = await categoryService.getCategoryById(id);
            (0, response_1.sendSuccess)({
                res,
                message: "Detail kategori berhasil diambil",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CategoryController = CategoryController;
//# sourceMappingURL=category.controller.js.map