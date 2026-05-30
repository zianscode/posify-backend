import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Seed Roles
  const roles = [{ name: "admin" }, { name: "manager" }, { name: "kasir" }];

  console.log("Creating roles...");
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  // Get created roles
  const dbRoles = await prisma.role.findMany();
  const adminRole = dbRoles.find((r) => r.name === "admin");
  const managerRole = dbRoles.find((r) => r.name === "manager");
  const cashierRole = dbRoles.find((r) => r.name === "kasir");

  if (!adminRole || !managerRole || !cashierRole) {
    throw new Error("Failed to seed roles correctly");
  }

  // 2. Seed Payment Methods
  const paymentMethods = [
    { name: "cash" },
    { name: "QRIS" },
    { name: "transfer" },
  ];

  console.log("Creating payment methods...");
  for (const pm of paymentMethods) {
    await prisma.paymentMethod.upsert({
      where: { name: pm.name },
      update: {},
      create: pm,
    });
  }

  // 3. Seed Outlets
  console.log("Creating default outlet...");
  // Use upsert or find first to prevent duplicate creation on multiple runs
  let defaultOutlet = await prisma.outlet.findFirst({
    where: { name: "POSify Central Outlet" },
  });

  if (!defaultOutlet) {
    defaultOutlet = await prisma.outlet.create({
      data: {
        name: "POSify Central Outlet",
        address: "Jl. Jenderal Sudirman No. 1, Jakarta",
        phone: "021-5551234",
      },
    });
  }

  // 4. Seed Default Admin, Manager, and Cashier Users
  console.log("Creating default users...");
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // Admin user
  await prisma.user.upsert({
    where: { email: "admin@posify.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@posify.com",
      password: hashedPassword,
      roleId: adminRole.id,
      outletId: defaultOutlet.id,
    },
  });

  // Manager user
  await prisma.user.upsert({
    where: { email: "manager@posify.com" },
    update: {},
    create: {
      name: "Store Manager",
      email: "manager@posify.com",
      password: hashedPassword,
      roleId: managerRole.id,
      outletId: defaultOutlet.id,
    },
  });

  // Cashier user
  await prisma.user.upsert({
    where: { email: "kasir@posify.com" },
    update: {},
    create: {
      name: "Cashier Terminal 1",
      email: "kasir@posify.com",
      password: hashedPassword,
      roleId: cashierRole.id,
      outletId: defaultOutlet.id,
    },
  });

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
