-- DropForeignKey
ALTER TABLE "halls_users" DROP CONSTRAINT "halls_users_hallId_fkey";

-- AddForeignKey
ALTER TABLE "halls_users" ADD CONSTRAINT "halls_users_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "halls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
