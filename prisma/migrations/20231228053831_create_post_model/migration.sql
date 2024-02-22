-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "productId" TEXT NOT NULL,
    "commerceId" TEXT NOT NULL,
    "price" DECIMAL(20,2) NOT NULL,
    "authorId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "publishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_commerceId_fkey" FOREIGN KEY ("commerceId") REFERENCES "Commerce"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

--AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
