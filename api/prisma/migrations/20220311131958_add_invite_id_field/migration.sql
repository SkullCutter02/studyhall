/*
  Warnings:

  - You are about to drop the column `code` on the `halls` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inviteId]` on the table `halls` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "halls_code_key";

-- AlterTable
ALTER TABLE "halls" DROP COLUMN "code",
ADD COLUMN     "inviteId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "halls_inviteId_key" ON "halls"("inviteId");
