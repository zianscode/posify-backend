"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const database_1 = require("../../config/database");
const socket_1 = require("../../config/socket");
class AdminService {
    async resetData() {
        await database_1.prisma.$transaction([
            database_1.prisma.notification.deleteMany(),
            database_1.prisma.transactionItem.deleteMany(),
            database_1.prisma.stockMovement.deleteMany(),
            database_1.prisma.productAddOn.deleteMany(),
            database_1.prisma.transaction.deleteMany(),
            database_1.prisma.product.deleteMany(),
            database_1.prisma.addOn.deleteMany(),
        ]);
        (0, socket_1.getIO)().emit("data-reset", {
            message: "Data telah direset oleh admin. Silakan login atau register ulang.",
            timestamp: new Date().toISOString(),
        });
        return { message: "Semua data transaksi, produk, stok, dan notification berhasil direset" };
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map