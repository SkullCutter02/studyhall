/*
  Warnings:

  - Added the required column `code` to the `halls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `halls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "halls" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
