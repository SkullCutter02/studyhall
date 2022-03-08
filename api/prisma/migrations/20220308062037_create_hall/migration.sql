-- CreateEnum
CREATE TYPE "HallRole" AS ENUM ('teacher', 'student');

-- CreateTable
CREATE TABLE "halls" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "halls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "halls_users" (
    "role" "HallRole" NOT NULL,
    "nickname" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hallId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "halls_users_pkey" PRIMARY KEY ("hallId","userId")
);

-- AddForeignKey
ALTER TABLE "halls_users" ADD CONSTRAINT "halls_users_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "halls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "halls_users" ADD CONSTRAINT "halls_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
