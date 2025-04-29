-- AlterTable
ALTER TABLE "User" ADD COLUMN     "codeOtp" TEXT,
ADD COLUMN     "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false;
