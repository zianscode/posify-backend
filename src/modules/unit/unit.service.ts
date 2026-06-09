import { prisma } from "../../config/database";
import { NotFoundError } from "../../shared/errors";

export class UnitService {
  async getUnits() {
    return prisma.unit.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }

  async getUnitById(id: number) {
    const unit = await prisma.unit.findUnique({
      where: { id },
    });

    if (!unit) {
      throw new NotFoundError("Unit tidak ditemukan");
    }

    return unit;
  }
}
