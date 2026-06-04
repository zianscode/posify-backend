import { prisma } from "../../config/database";
import { NotFoundError, BadRequestError } from "../../shared/errors";

export class AddOnService {
  async createAddOn(name: string, price: number, description?: string | null) {
    return prisma.addOn.create({
      data: {
        name,
        price,
        ...(description !== undefined ? { description } : {}),
      },
    });
  }

  async getAddOns() {
    return prisma.addOn.findMany({
      orderBy: { id: "asc" },
    });
  }

  async getAddOnById(id: number) {
    const addOn = await prisma.addOn.findUnique({
      where: { id },
    });

    if (!addOn) {
      throw new NotFoundError("Add-on tidak ditemukan");
    }

    return addOn;
  }

  async updateAddOn(id: number, data: { name?: string; price?: number; description?: string | null }) {
    await this.getAddOnById(id);

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.description !== undefined) updateData.description = data.description;

    return prisma.addOn.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteAddOn(id: number) {
    await this.getAddOnById(id);

    const productCount = await prisma.productAddOn.count({
      where: { addOnId: id },
    });

    if (productCount > 0) {
      throw new BadRequestError(
        "Add-on tidak dapat dihapus karena masih dikaitkan dengan produk"
      );
    }

    return prisma.addOn.delete({
      where: { id },
    });
  }
}
