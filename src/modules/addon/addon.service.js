"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddOnService = void 0;
const database_1 = require("../../config/database");
const errors_1 = require("../../shared/errors");
class AddOnService {
    async createAddOn(name, price, description) {
        return database_1.prisma.addOn.create({
            data: {
                name,
                price,
                ...(description !== undefined ? { description } : {}),
            },
        });
    }
    async getAddOns() {
        return database_1.prisma.addOn.findMany({
            orderBy: { id: "asc" },
        });
    }
    async getAddOnById(id) {
        const addOn = await database_1.prisma.addOn.findUnique({
            where: { id },
        });
        if (!addOn) {
            throw new errors_1.NotFoundError("Add-on tidak ditemukan");
        }
        return addOn;
    }
    async updateAddOn(id, data) {
        await this.getAddOnById(id);
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.price !== undefined)
            updateData.price = data.price;
        if (data.description !== undefined)
            updateData.description = data.description;
        return database_1.prisma.addOn.update({
            where: { id },
            data: updateData,
        });
    }
    async deleteAddOn(id) {
        await this.getAddOnById(id);
        const productCount = await database_1.prisma.productAddOn.count({
            where: { addOnId: id },
        });
        if (productCount > 0) {
            throw new errors_1.BadRequestError("Add-on tidak dapat dihapus karena masih dikaitkan dengan produk");
        }
        return database_1.prisma.addOn.delete({
            where: { id },
        });
    }
}
exports.AddOnService = AddOnService;
//# sourceMappingURL=addon.service.js.map