import { prisma } from "../../config/database";
import { NotFoundError, BadRequestError } from "../../shared/errors";

export class UnitService {
  /**
   * Create a new unit
   */
  async createUnit(name: string) {
    return prisma.unit.create({
      data: { name },
    });
  }

  /**
   * Get all units
   */
  async getUnits() {
    return prisma.unit.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }

  /**
   * Get unit by ID
   */
  async getUnitById(id: number) {
    const unit = await prisma.unit.findUnique({
      where: { id },
    });

    if (!unit) {
      throw new NotFoundError("Unit tidak ditemukan");
    }

    return unit;
  }

  /**
   * Update unit by ID
   */
  async updateUnit(id: number, name: string) {
    // Check if unit exists
    await this.getUnitById(id);

    return prisma.unit.update({
      where: { id },
      data: { name },
    });
  }

  /**
   * Delete unit by ID
   */
  async deleteUnit(id: number) {
    // Check if unit exists
    await this.getUnitById(id);

    // Check if unit is used by any products
    const productCount = await prisma.product.count({
      where: { unitId: id },
    });

    if (productCount > 0) {
      throw new BadRequestError(
        "Unit tidak dapat dihapus karena masih dikaitkan dengan produk"
      );
    }

    return prisma.unit.delete({
      where: { id },
    });
  }
}
