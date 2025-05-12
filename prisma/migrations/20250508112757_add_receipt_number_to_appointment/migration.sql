-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "receiptNumber" TEXT,
ALTER COLUMN "scheduledAt" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL;
