-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "promoCode" TEXT,
ADD COLUMN     "promoUsed" BOOLEAN NOT NULL DEFAULT false;
