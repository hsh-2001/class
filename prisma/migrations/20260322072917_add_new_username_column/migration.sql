/*
  Warnings:

  - A unique constraint covering the columns `[email,username,school_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_email_school_id_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "username" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "users_email_username_school_id_key" ON "users"("email", "username", "school_id");
