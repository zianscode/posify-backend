-- CreateTable
CREATE TABLE "add_ons" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "add_ons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_add_ons" (
    "product_id" INTEGER NOT NULL,
    "add_on_id" INTEGER NOT NULL,

    CONSTRAINT "product_add_ons_pkey" PRIMARY KEY ("product_id","add_on_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "add_ons_name_key" ON "add_ons"("name");

-- AddForeignKey
ALTER TABLE "product_add_ons" ADD CONSTRAINT "product_add_ons_add_on_id_fkey" FOREIGN KEY ("add_on_id") REFERENCES "add_ons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_add_ons" ADD CONSTRAINT "product_add_ons_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
