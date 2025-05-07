/*
  Warnings:

  - Added the required column `titleNumber` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleType` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vin` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "titleNumber" TEXT NOT NULL,
ADD COLUMN     "vehicleType" TEXT NOT NULL,
ADD COLUMN     "vin" TEXT NOT NULL,
ALTER COLUMN "scheduledAt" SET DATA TYPE TEXT,
ALTER COLUMN "deletedAt" SET DATA TYPE TEXT;
