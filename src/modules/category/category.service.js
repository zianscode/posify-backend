"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const database_1 = require("../../config/database");
const errors_1 = require("../../shared/errors");
class CategoryService {
    async getCategories() {
        return database_1.prisma.category.findMany({
            orderBy: {
                id: "asc",
            },
        });
    }
    async getCategoryById(id) {
        const category = await database_1.prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new errors_1.NotFoundError("Kategori tidak ditemukan");
        }
        return category;
    }
}
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map