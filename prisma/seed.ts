import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcrypt";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...");

  const dbRoles = await prisma.role.findMany();
  const managerRole = dbRoles.find((r) => r.name === "manager");
  const cashierRole = dbRoles.find((r) => r.name === "kasir");

  if (!managerRole || !cashierRole) {
    throw new Error("Roles belum tersedia. Jalankan migration terlebih dahulu.");
  }

  // 1. Seed demo Manager & Kasir (opsional, untuk testing)
  console.log("Creating demo users...");
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const outlet = await prisma.outlet.findFirst({
    where: { name: "Warmindo Pusat" },
  });

  if (outlet) {
    await prisma.user.upsert({
      where: { email: "manager@gmail.com" },
      update: {},
      create: {
        name: "Store Manager",
        email: "manager@gmail.com",
        password: hashedPassword,
        roleId: managerRole.id,
        outletId: outlet.id,
      },
    });

    await prisma.user.upsert({
      where: { email: "kasir@gmail.com" },
      update: {},
      create: {
        name: "Kasir Terminal 1",
        email: "kasir@gmail.com",
        password: hashedPassword,
        roleId: cashierRole.id,
        outletId: outlet.id,
      },
    });
  }

  // 2. Fetch master data (already seeded via migration)
  const dbCategories = await prisma.category.findMany();
  const getCategoryId = (name: string) =>
    dbCategories.find((c) => c.name === name)!.id;

  const dbUnits = await prisma.unit.findMany();
  const getUnitId = (name: string) => dbUnits.find((u) => u.name === name)!.id;

  // 3. Seed Products (Warmindo original)
  console.log("Creating products...");

  interface ProductData {
    name: string;
    category: string;
    unit: string;
    price: number;
    costPrice: number;
    stock: number;
    minStock: number;
    description: string;
  }

  // ─── Nasi ───────────────────────────────────────────────────────────────────
  const nasi: ProductData[] = [
    { name: "Nasi Putih", category: "Nasi", unit: "Porsi", price: 5000, costPrice: 2000, stock: 80, minStock: 20, description: "Nasi putih hangat pulen" },
    { name: "Nasi Kuning", category: "Nasi", unit: "Porsi", price: 7000, costPrice: 3000, stock: 30, minStock: 10, description: "Nasi kuning bumbu kunyit komplit" },
    { name: "Nasi Uduk", category: "Nasi", unit: "Porsi", price: 8000, costPrice: 3500, stock: 35, minStock: 10, description: "Nasi uduk santan wangi" },
    { name: "Nasi Liwet", category: "Nasi", unit: "Porsi", price: 10000, costPrice: 4500, stock: 25, minStock: 5, description: "Nasi liwet sunda with tahu tempe" },
    { name: "Nasi Bakar", category: "Nasi", unit: "Porsi", price: 12000, costPrice: 5500, stock: 20, minStock: 5, description: "Nasi bakar isi suwiran ayam" },
    { name: "Nasi Megono", category: "Nasi", unit: "Porsi", price: 10000, costPrice: 4000, stock: 20, minStock: 5, description: "Nasi megono khas Pekalongan" },
  ];

  // ─── Makanan ────────────────────────────────────────────────────────────────
  const makanan: ProductData[] = [
    { name: "Ayam Goreng", category: "Makanan", unit: "Pcs", price: 20000, costPrice: 10000, stock: 40, minStock: 10, description: "Ayam goreng tepung crispy" },
    { name: "Ayam Bakar", category: "Makanan", unit: "Pcs", price: 25000, costPrice: 12000, stock: 30, minStock: 8, description: "Ayam bakar bumbu kecap manis" },
    { name: "Ayam Penyet", category: "Makanan", unit: "Pcs", price: 22000, costPrice: 11000, stock: 30, minStock: 8, description: "Ayam penyet sambal terasi" },
    { name: "Ayam Geprek", category: "Makanan", unit: "Pcs", price: 20000, costPrice: 10000, stock: 35, minStock: 8, description: "Ayam geprek sambal bawang" },
    { name: "Ikan Goreng", category: "Makanan", unit: "Pcs", price: 18000, costPrice: 9000, stock: 25, minStock: 5, description: "Ikan nila goreng segar" },
    { name: "Ikan Bakar", category: "Makanan", unit: "Pcs", price: 25000, costPrice: 12000, stock: 20, minStock: 5, description: "Ikan gurame bakar bumbu rujak" },
    { name: "Ikan Tongkol Balado", category: "Makanan", unit: "Pcs", price: 15000, costPrice: 7000, stock: 20, minStock: 5, description: "Tongkol balado pedas" },
    { name: "Rendang Daging", category: "Makanan", unit: "Porsi", price: 30000, costPrice: 15000, stock: 20, minStock: 5, description: "Rendang daging sapi empuk" },
    { name: "Semur Daging", category: "Makanan", unit: "Porsi", price: 25000, costPrice: 12000, stock: 15, minStock: 5, description: "Semur daging kecap manis" },
    { name: "Sate Ayam", category: "Makanan", unit: "Porsi", price: 18000, costPrice: 9000, stock: 25, minStock: 5, description: "Sate ayam bumbu kacang (10 tusuk)" },
    { name: "Sate Kambing", category: "Makanan", unit: "Porsi", price: 30000, costPrice: 15000, stock: 15, minStock: 3, description: "Sate kambing muda bumbu kecap" },
    { name: "Empal Gepuk", category: "Makanan", unit: "Pcs", price: 18000, costPrice: 9000, stock: 20, minStock: 5, description: "Empal gepuk daging sapi" },
    { name: "Gulai Kambing", category: "Makanan", unit: "Porsi", price: 28000, costPrice: 14000, stock: 15, minStock: 3, description: "Gulai kambing nangka" },
    { name: "Tongseng", category: "Makanan", unit: "Porsi", price: 25000, costPrice: 12000, stock: 15, minStock: 3, description: "Tongseng daging kambing" },
    { name: "Opor Ayam", category: "Makanan", unit: "Pcs", price: 20000, costPrice: 10000, stock: 20, minStock: 5, description: "Opor ayam kuah santan" },
  ];

  // ─── Lauk ───────────────────────────────────────────────────────────────────
  const lauk: ProductData[] = [
    { name: "Telur Balado", category: "Lauk", unit: "Pcs", price: 5000, costPrice: 2500, stock: 40, minStock: 10, description: "Telur goreng bumbu balado" },
    { name: "Telur Dadar", category: "Lauk", unit: "Pcs", price: 4000, costPrice: 2000, stock: 40, minStock: 10, description: "Telur dadar iris tipis" },
    { name: "Telur Ceplok", category: "Lauk", unit: "Pcs", price: 4000, costPrice: 2000, stock: 40, minStock: 10, description: "Telur ceplok setengah matang" },
    { name: "Tahu Goreng", category: "Lauk", unit: "Pcs", price: 3000, costPrice: 1000, stock: 60, minStock: 15, description: "Tahu goreng crispy" },
    { name: "Tahu Bacem", category: "Lauk", unit: "Pcs", price: 3000, costPrice: 1500, stock: 30, minStock: 10, description: "Tahu bacem manis gurih" },
    { name: "Tempe Goreng", category: "Lauk", unit: "Pcs", price: 3000, costPrice: 1000, stock: 60, minStock: 15, description: "Tempe goreng tipis renyah" },
    { name: "Tempe Bacem", category: "Lauk", unit: "Pcs", price: 3000, costPrice: 1500, stock: 30, minStock: 10, description: "Tempe bacem manis legit" },
    { name: "Perkedel Kentang", category: "Lauk", unit: "Pcs", price: 4000, costPrice: 2000, stock: 35, minStock: 10, description: "Perkedel kentang wortel" },
    { name: "Perkedel Jagung", category: "Lauk", unit: "Pcs", price: 4000, costPrice: 2000, stock: 25, minStock: 5, description: "Perkedel jagung manis" },
    { name: "Ati Ampela", category: "Lauk", unit: "Pcs", price: 7000, costPrice: 3500, stock: 20, minStock: 5, description: "Ati ampela goreng bumbu" },
    { name: "Usus Goreng", category: "Lauk", unit: "Pcs", price: 5000, costPrice: 2500, stock: 20, minStock: 5, description: "Usus ayam goreng crispy" },
    { name: "Ceker Ayam", category: "Lauk", unit: "Pcs", price: 4000, costPrice: 2000, stock: 25, minStock: 5, description: "Ceker ayam bumbu pedas" },
    { name: "Sambal Goreng Kentang", category: "Lauk", unit: "Porsi", price: 6000, costPrice: 3000, stock: 20, minStock: 5, description: "Sambal goreng kentang ati" },
  ];

  // ─── Sayuran ────────────────────────────────────────────────────────────────
  const sayuran: ProductData[] = [
    { name: "Tumis Kangkung", category: "Sayuran", unit: "Porsi", price: 8000, costPrice: 3500, stock: 25, minStock: 5, description: "Tumis kangkung belacan" },
    { name: "Tumis Kacang Panjang", category: "Sayuran", unit: "Porsi", price: 7000, costPrice: 3000, stock: 20, minStock: 5, description: "Tumis kacang panjang tempe" },
    { name: "Tumis Buncis", category: "Sayuran", unit: "Porsi", price: 7000, costPrice: 3000, stock: 20, minStock: 5, description: "Tumis buncis wortel" },
    { name: "Capcay", category: "Sayuran", unit: "Porsi", price: 12000, costPrice: 5500, stock: 20, minStock: 5, description: "Capcay sayuran segar" },
    { name: "Sayur Asem", category: "Sayuran", unit: "Mangkok", price: 7000, costPrice: 3000, stock: 20, minStock: 5, description: "Sayur asem segar" },
    { name: "Sayur Lodeh", category: "Sayuran", unit: "Mangkok", price: 8000, costPrice: 3500, stock: 15, minStock: 5, description: "Sayur lodeh santan" },
    { name: "Plecing Kangkung", category: "Sayuran", unit: "Porsi", price: 10000, costPrice: 4500, stock: 15, minStock: 5, description: "Plecing kangkung sambal tomat" },
    { name: "Urap Sayur", category: "Sayuran", unit: "Porsi", price: 8000, costPrice: 3500, stock: 15, minStock: 5, description: "Urap sayuran kelapa parut" },
    { name: "Lalapan Segar", category: "Sayuran", unit: "Porsi", price: 3000, costPrice: 1000, stock: 40, minStock: 15, description: "Lalapan mentah segar" },
  ];

  // ─── Kuah / Sup ─────────────────────────────────────────────────────────────
  const kuah: ProductData[] = [
    { name: "Soto Ayam", category: "Kuah / Sup", unit: "Mangkok", price: 15000, costPrice: 7000, stock: 25, minStock: 5, description: "Soto ayam kuah kuning" },
    { name: "Soto Betawi", category: "Kuah / Sup", unit: "Mangkok", price: 20000, costPrice: 10000, stock: 15, minStock: 5, description: "Soto betawi kuah susu/santan" },
    { name: "Soto Mie", category: "Kuah / Sup", unit: "Mangkok", price: 18000, costPrice: 8000, stock: 15, minStock: 5, description: "Soto mie bogor" },
    { name: "Bakso Sapi", category: "Kuah / Sup", unit: "Mangkok", price: 15000, costPrice: 7000, stock: 40, minStock: 10, description: "Bakso sapi original + mie" },
    { name: "Mie Ayam", category: "Kuah / Sup", unit: "Mangkok", price: 12000, costPrice: 5000, stock: 35, minStock: 10, description: "Mie ayam pangsit" },
    { name: "Sop Ayam", category: "Kuah / Sup", unit: "Mangkok", price: 15000, costPrice: 7000, stock: 20, minStock: 5, description: "Sop ayam bening sayuran" },
    { name: "Sop Iga", category: "Kuah / Sup", unit: "Mangkok", price: 30000, costPrice: 15000, stock: 10, minStock: 3, description: "Sop iga sapi empuk" },
    { name: "Sop Buntut", category: "Kuah / Sup", unit: "Mangkok", price: 35000, costPrice: 18000, stock: 10, minStock: 3, description: "Sop buntut sapi gurih" },
    { name: "Rawon", category: "Kuah / Sup", unit: "Mangkok", price: 20000, costPrice: 10000, stock: 15, minStock: 5, description: "Rawon daging sapi khas Surabaya" },
    { name: "Coto Makassar", category: "Kuah / Sup", unit: "Mangkok", price: 25000, costPrice: 12000, stock: 10, minStock: 3, description: "Coto makassar kacang" },
  ];

  // ─── Gorengan ───────────────────────────────────────────────────────────────
  const gorengan: ProductData[] = [
    { name: "Pisang Goreng", category: "Gorengan", unit: "Bungkus", price: 3000, costPrice: 1000, stock: 40, minStock: 10, description: "Pisang goreng crispy" },
    { name: "Pisang Goreng Keju", category: "Gorengan", unit: "Bungkus", price: 5000, costPrice: 2500, stock: 25, minStock: 5, description: "Pisang goreng toping keju" },
    { name: "Tahu Isi", category: "Gorengan", unit: "Bungkus", price: 3000, costPrice: 1500, stock: 40, minStock: 10, description: "Tahu isi sayuran" },
    { name: "Tahu Crispy", category: "Gorengan", unit: "Bungkus", price: 5000, costPrice: 2500, stock: 30, minStock: 5, description: "Tahu crispy renyah" },
    { name: "Tempe Mendoan", category: "Gorengan", unit: "Bungkus", price: 3000, costPrice: 1000, stock: 40, minStock: 10, description: "Tempe mendoan khas Purwokerto" },
    { name: "Bakwan", category: "Gorengan", unit: "Bungkus", price: 2000, costPrice: 1000, stock: 50, minStock: 15, description: "Bakwan sayuran" },
    { name: "Risoles", category: "Gorengan", unit: "Bungkus", price: 4000, costPrice: 2000, stock: 25, minStock: 5, description: "Risoles isi daging cincang sayur" },
    { name: "Lumpia", category: "Gorengan", unit: "Bungkus", price: 5000, costPrice: 2500, stock: 20, minStock: 5, description: "Lumpia isi rebung" },
    { name: "Cireng", category: "Gorengan", unit: "Bungkus", price: 4000, costPrice: 2000, stock: 30, minStock: 5, description: "Cireng sambal rujak" },
    { name: "Molokhia", category: "Gorengan", unit: "Bungkus", price: 3000, costPrice: 1000, stock: 25, minStock: 5, description: "Molokhia bayam crispy" },
  ];

  // ─── Minuman ────────────────────────────────────────────────────────────────
  const minuman: ProductData[] = [
    { name: "Es Teh Manis", category: "Minuman", unit: "Gelas", price: 4000, costPrice: 1500, stock: 80, minStock: 20, description: "Es teh manis segar" },
    { name: "Teh Hangat Manis", category: "Minuman", unit: "Gelas", price: 3000, costPrice: 1000, stock: 60, minStock: 15, description: "Teh hangat manis" },
    { name: "Teh Hangat Tawar", category: "Minuman", unit: "Gelas", price: 2500, costPrice: 1000, stock: 30, minStock: 10, description: "Teh hangat tanpa gula" },
    { name: "Es Jeruk", category: "Minuman", unit: "Gelas", price: 6000, costPrice: 2500, stock: 50, minStock: 15, description: "Es jeruk peras segar" },
    { name: "Jeruk Hangat", category: "Minuman", unit: "Gelas", price: 5000, costPrice: 2000, stock: 30, minStock: 10, description: "Jeruk hangat manis" },
    { name: "Kopi Hitam", category: "Minuman", unit: "Gelas", price: 5000, costPrice: 2000, stock: 50, minStock: 15, description: "Kopi hitam tradisional" },
    { name: "Kopi Susu", category: "Minuman", unit: "Gelas", price: 8000, costPrice: 3500, stock: 40, minStock: 10, description: "Kopi susu gula aren" },
    { name: "Es Kopi Susu", category: "Minuman", unit: "Gelas", price: 10000, costPrice: 4500, stock: 35, minStock: 10, description: "Es kopi susu kekinian" },
    { name: "Susu Hangat", category: "Minuman", unit: "Gelas", price: 6000, costPrice: 3000, stock: 25, minStock: 5, description: "Susu hangat madu" },
    { name: "Susu Jahe", category: "Minuman", unit: "Gelas", price: 7000, costPrice: 3500, stock: 20, minStock: 5, description: "Susu jahe hangat" },
    { name: "Es Campur", category: "Minuman", unit: "Gelas", price: 12000, costPrice: 6000, stock: 20, minStock: 5, description: "Es campur buah segar" },
    { name: "Es Teler", category: "Minuman", unit: "Gelas", price: 15000, costPrice: 7000, stock: 15, minStock: 5, description: "Es teler alpukat" },
    { name: "Wedang Jahe", category: "Minuman", unit: "Gelas", price: 5000, costPrice: 2000, stock: 25, minStock: 5, description: "Wedang jahe hangat" },
    { name: "Wedang Uwuh", category: "Minuman", unit: "Gelas", price: 7000, costPrice: 3000, stock: 15, minStock: 5, description: "Wedang uwuh rempah" },
    { name: "Air Mineral", category: "Minuman", unit: "Botol", price: 3000, costPrice: 1500, stock: 100, minStock: 30, description: "Air mineral botol 600ml" },
  ];

  // ─── Kudapan ────────────────────────────────────────────────────────────────
  const kudapan: ProductData[] = [
    { name: "Lemper Ayam", category: "Kudapan", unit: "Pcs", price: 4000, costPrice: 2000, stock: 25, minStock: 5, description: "Lemper isi suwiran ayam" },
    { name: "Lontong Isi", category: "Kudapan", unit: "Pcs", price: 5000, costPrice: 2500, stock: 20, minStock: 5, description: "Lontong isi sayur" },
    { name: "Klepon", category: "Kudapan", unit: "Bungkus", price: 3000, costPrice: 1500, stock: 25, minStock: 5, description: "Klepon gula jawa" },
    { name: "Onde-onde", category: "Kudapan", unit: "Bungkus", price: 4000, costPrice: 2000, stock: 20, minStock: 5, description: "Onde-onde isi kacang hijau" },
    { name: "Nagasari", category: "Kudapan", unit: "Pcs", price: 3000, costPrice: 1500, stock: 20, minStock: 5, description: "Nagasari pisang" },
    { name: "Bubur Ketan Hitam", category: "Kudapan", unit: "Mangkok", price: 8000, costPrice: 3500, stock: 15, minStock: 5, description: "Bubur ketan hitam santan" },
    { name: "Bubur Sumsum", category: "Kudapan", unit: "Mangkok", price: 7000, costPrice: 3000, stock: 15, minStock: 5, description: "Bubur sumsum kuah gula merah" },
    { name: "Kue Lumpur", category: "Kudapan", unit: "Bungkus", price: 5000, costPrice: 2500, stock: 20, minStock: 5, description: "Kue lumpur kentang" },
    { name: "Putri Mandi", category: "Kudapan", unit: "Bungkus", price: 4000, costPrice: 2000, stock: 15, minStock: 5, description: "Putri mandi hijau" },
    { name: "Dadar Gulung", category: "Kudapan", unit: "Pcs", price: 4000, costPrice: 2000, stock: 20, minStock: 5, description: "Dadar gulung isi kelapa" },
  ];

  const products: ProductData[] = [
    ...nasi, ...makanan, ...lauk, ...sayuran,
    ...kuah, ...gorengan, ...minuman, ...kudapan,
  ];

  for (const p of products) {
    const existing = await prisma.product.findFirst({
      where: { name: p.name },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          price: p.price,
          costPrice: p.costPrice,
          stock: p.stock,
          minStock: p.minStock,
          description: p.description,
        },
      });
    } else {
      await prisma.product.create({
        data: {
          name: p.name,
          categoryId: getCategoryId(p.category),
          unitId: getUnitId(p.unit),
          price: p.price,
          costPrice: p.costPrice,
          stock: p.stock,
          minStock: p.minStock,
          description: p.description,
        },
      });
    }
  }

  // 4. Seed Add-Ons
  console.log("Creating add-ons...");

  const addOnData = [
    { name: "Tambah Nasi", price: 4000, description: "Nasi putih tambahan" },
    { name: "Nasi Putih", price: 5000, description: "Nasi putih terpisah" },
    { name: "Mie Tambah", price: 5000, description: "Mie instant tambahan" },
    { name: "Extra Telur", price: 4000, description: "Telur tambahan" },
    { name: "Extra Tahu", price: 3000, description: "Tahu goreng tambahan" },
    { name: "Extra Tempe", price: 3000, description: "Tempe goreng tambahan" },
    { name: "Extra Kerupuk", price: 2000, description: "Kerupuk tambahan" },
    { name: "Extra Sambal", price: 2000, description: "Sambal tambahan" },
    { name: "Extra Lauk", price: 5000, description: "Lauk pilihan tambahan" },
    { name: "Keju Parut", price: 3000, description: "Keju parut topping" },
    { name: "Susu Kental Manis", price: 2000, description: "SKM tambahan" },
    { name: "Bubble", price: 5000, description: "Bubble tapioca pearl" },
  ];

  for (const a of addOnData) {
    await prisma.addOn.upsert({
      where: { name: a.name },
      update: { price: a.price, description: a.description },
      create: a,
    });
  }

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
