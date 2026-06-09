import { prisma } from "../../config/database";
import { NotFoundError } from "../../shared/errors";

export class CategoryService {
  async getCategories() {
    return prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }

  async getCategoryById(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundError("Kategori tidak ditemukan");
    }

    return category;
  }
}
