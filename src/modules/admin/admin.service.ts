import { prisma } from "../../config/database";
import { getIO } from "../../config/socket";

export class AdminService {
  async resetData() {
    await prisma.$transaction([
      prisma.notification.deleteMany(),
      prisma.transactionItem.deleteMany(),
      prisma.stockMovement.deleteMany(),
      prisma.productAddOn.deleteMany(),
      prisma.transaction.deleteMany(),
      prisma.product.deleteMany(),
      prisma.addOn.deleteMany(),
    ]);

    getIO().emit("data-reset", {
      message: "Data telah direset oleh admin. Silakan login atau register ulang.",
      timestamp: new Date().toISOString(),
    });

    return { message: "Semua data transaksi, produk, stok, dan notification berhasil direset" };
  }
}
