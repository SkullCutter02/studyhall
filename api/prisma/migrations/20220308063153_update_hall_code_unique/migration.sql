/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `halls` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "halls_code_key" ON "halls"("code");
