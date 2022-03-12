/*
  Warnings:

  - You are about to drop the column `userId` on the `public_files` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[avatarId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public_files" DROP CONSTRAINT "public_files_userId_fkey";

-- DropIndex
DROP INDEX "public_files_userId_key";

-- AlterTable
ALTER TABLE "public_files" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatarId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_avatarId_key" ON "users"("avatarId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "public_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
