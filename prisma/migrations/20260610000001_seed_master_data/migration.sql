-- Seed Roles
INSERT INTO "roles" ("name")
VALUES ('admin'), ('manager'), ('kasir')
ON CONFLICT ("name") DO NOTHING;

-- Seed Default Outlet
INSERT INTO "outlets" ("name", "address", "phone")
SELECT 'Warmindo Pusat', 'Jl. Merdeka No. 1, Jakarta', '021-5551234'
WHERE NOT EXISTS (
  SELECT 1 FROM "outlets" WHERE "name" = 'Warmindo Pusat'
);

-- Seed Default Admin User (password: admin123)
INSERT INTO "users" ("name", "email", "password", "role_id", "outlet_id", "created_at", "updated_at")
VALUES (
  'Super Admin',
  'admin@gmail.com',
  '$2b$10$HFE3spWhHnuQnK7GvtVRHON9HJat54QgpcLRxfYX49bdnD/h4Y1Uy',
  (SELECT id FROM "roles" WHERE "name" = 'admin'),
  (SELECT id FROM "outlets" WHERE "name" = 'Warmindo Pusat'),
  NOW(), NOW()
)
ON CONFLICT ("email") DO NOTHING;

-- Seed Payment Methods
INSERT INTO "payment_methods" ("name")
VALUES ('Tunai'), ('QRIS'), ('GoPay'), ('OVO'), ('Transfer Bank')
ON CONFLICT ("name") DO NOTHING;

-- Seed Categories (Warmindo)
INSERT INTO "categories" ("name")
VALUES ('Nasi'), ('Makanan'), ('Lauk'), ('Sayuran'), ('Kuah / Sup'), ('Gorengan'), ('Minuman'), ('Kudapan')
ON CONFLICT ("name") DO NOTHING;

-- Seed Units (Warmindo)
INSERT INTO "units" ("name")
VALUES ('Porsi'), ('Pcs'), ('Gelas'), ('Mangkok'), ('Bungkus'), ('Botol')
ON CONFLICT ("name") DO NOTHING;
