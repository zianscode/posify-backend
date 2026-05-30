import { prisma } from "../../config/database";
import { NotFoundError, BadRequestError } from "../../shared/errors";

export class CategoryService {
  /**
   * Create a new category
   */
  async createCategory(name: string) {
    return prisma.category.create({
      data: { name },
    });
  }

  /**
   * Get all categories
   */
  async getCategories() {
    return prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundError("Kategori tidak ditemukan");
    }

    return category;
  }

  /**
   * Update category by ID
   */
  async updateCategory(id: number, name: string) {
    // Check if category exists
    await this.getCategoryById(id);

    return prisma.category.update({
      where: { id },
      data: { name },
    });
  }

  /**
   * Delete category by ID
   */
  async deleteCategory(id: number) {
    // Check if category exists
    await this.getCategoryById(id);

    // Check if category is used by any products
    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      throw new BadRequestError(
        "Kategori tidak dapat dihapus karena masih dikaitkan dengan produk"
      );
    }

    return prisma.category.delete({
      where: { id },
    });
  }
}
