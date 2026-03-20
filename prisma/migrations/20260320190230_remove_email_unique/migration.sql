/*
  Warnings:

  - A unique constraint covering the columns `[email,school_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "users_email_school_id_key" ON "users"("email", "school_id");
