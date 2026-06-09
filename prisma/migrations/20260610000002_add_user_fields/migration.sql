-- AlterTable: Add user profile and reset password fields
ALTER TABLE "users" ADD COLUMN "avatar" TEXT;
ALTER TABLE "users" ADD COLUMN "reset_password_token" TEXT;
ALTER TABLE "users" ADD COLUMN "reset_password_expires" TIMESTAMP(3);
