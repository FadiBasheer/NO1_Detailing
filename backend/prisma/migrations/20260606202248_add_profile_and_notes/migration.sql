-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "defaultAddress" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "phone" TEXT;
