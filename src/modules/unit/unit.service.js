"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitService = void 0;
const database_1 = require("../../config/database");
const errors_1 = require("../../shared/errors");
class UnitService {
    async getUnits() {
        return database_1.prisma.unit.findMany({
            orderBy: {
                id: "asc",
            },
        });
    }
    async getUnitById(id) {
        const unit = await database_1.prisma.unit.findUnique({
            where: { id },
        });
        if (!unit) {
            throw new errors_1.NotFoundError("Unit tidak ditemukan");
        }
        return unit;
    }
}
exports.UnitService = UnitService;
//# sourceMappingURL=unit.service.js.map