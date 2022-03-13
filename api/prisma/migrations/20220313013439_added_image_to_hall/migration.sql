/*
  Warnings:

  - A unique constraint covering the columns `[imageId]` on the table `halls` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_avatarId_fkey";

-- AlterTable
ALTER TABLE "halls" ADD COLUMN     "imageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "halls_imageId_key" ON "halls"("imageId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "public_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "halls" ADD CONSTRAINT "halls_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
