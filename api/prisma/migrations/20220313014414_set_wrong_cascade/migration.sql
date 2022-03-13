-- DropForeignKey
ALTER TABLE "halls" DROP CONSTRAINT "halls_imageId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_avatarId_fkey";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "public_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "halls" ADD CONSTRAINT "halls_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
