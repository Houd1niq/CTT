-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authConfirmToken" TEXT,
ADD COLUMN     "authConfirmTokenExpiry" TIMESTAMP(3);
