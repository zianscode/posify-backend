-- CreateTable
CREATE TABLE "transaction_item_add_ons" (
    "id" SERIAL NOT NULL,
    "transaction_item_id" INTEGER NOT NULL,
    "add_on_id" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "transaction_item_add_ons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transaction_item_add_ons" ADD CONSTRAINT "transaction_item_add_ons_transaction_item_id_fkey" FOREIGN KEY ("transaction_item_id") REFERENCES "transaction_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_item_add_ons" ADD CONSTRAINT "transaction_item_add_ons_add_on_id_fkey" FOREIGN KEY ("add_on_id") REFERENCES "add_ons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
