-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "authorUID" TEXT NOT NULL;
UPDATE "Offer" set "authorUID"='';