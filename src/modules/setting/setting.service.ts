import { prisma } from "../../config/database";
import { NotFoundError, ConflictError } from "../../shared/errors";

export class SettingService {
  async createSetting(key: string, value: string, description?: string | null) {
    const existing = await prisma.setting.findUnique({
      where: { key },
    });

    if (existing) {
      throw new ConflictError("Setting dengan key tersebut sudah ada");
    }

    return prisma.setting.create({
      data: { key, value, description: description ?? null },
    });
  }

  async getSettings() {
    return prisma.setting.findMany({
      orderBy: { id: "asc" },
    });
  }

  async getSettingById(id: number) {
    const setting = await prisma.setting.findUnique({
      where: { id },
    });

    if (!setting) {
      throw new NotFoundError("Setting tidak ditemukan");
    }

    return setting;
  }

  async updateSetting(id: number, value: string, description?: string | null) {
    await this.getSettingById(id);

    const data: any = { value };
    if (description !== undefined) {
      data.description = description;
    }

    return prisma.setting.update({
      where: { id },
      data,
    });
  }

  async deleteSetting(id: number) {
    await this.getSettingById(id);

    return prisma.setting.delete({
      where: { id },
    });
  }
}
