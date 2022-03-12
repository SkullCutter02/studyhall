-- CreateTable
CREATE TABLE "public_files" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "public_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "public_files_url_key" ON "public_files"("url");

-- CreateIndex
CREATE UNIQUE INDEX "public_files_key_key" ON "public_files"("key");
