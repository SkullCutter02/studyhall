/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `public_files` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public_files" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "public_files_userId_key" ON "public_files"("userId");

-- AddForeignKey
ALTER TABLE "public_files" ADD CONSTRAINT "public_files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
