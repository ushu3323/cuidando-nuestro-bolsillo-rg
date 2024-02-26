-- CreateTable
CREATE TABLE "Colaboration" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Colaboration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Colaboration" ADD CONSTRAINT "Colaboration_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Colaboration" ADD CONSTRAINT "Colaboration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
