-- DropForeignKey
ALTER TABLE "halls_users" DROP CONSTRAINT "halls_users_userId_fkey";

-- AddForeignKey
ALTER TABLE "halls_users" ADD CONSTRAINT "halls_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
