"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingService = void 0;
const database_1 = require("../../config/database");
const errors_1 = require("../../shared/errors");
class SettingService {
    async createSetting(key, value, description) {
        const existing = await database_1.prisma.setting.findUnique({
            where: { key },
        });
        if (existing) {
            throw new errors_1.ConflictError("Setting dengan key tersebut sudah ada");
        }
        return database_1.prisma.setting.create({
            data: { key, value, description: description ?? null },
        });
    }
    async getSettings() {
        return database_1.prisma.setting.findMany({
            orderBy: { id: "asc" },
        });
    }
    async getSettingById(id) {
        const setting = await database_1.prisma.setting.findUnique({
            where: { id },
        });
        if (!setting) {
            throw new errors_1.NotFoundError("Setting tidak ditemukan");
        }
        return setting;
    }
    async updateSetting(id, value, description) {
        await this.getSettingById(id);
        const data = { value };
        if (description !== undefined) {
            data.description = description;
        }
        return database_1.prisma.setting.update({
            where: { id },
            data,
        });
    }
    async deleteSetting(id) {
        await this.getSettingById(id);
        return database_1.prisma.setting.delete({
            where: { id },
        });
    }
}
exports.SettingService = SettingService;
//# sourceMappingURL=setting.service.js.map