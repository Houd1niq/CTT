/*
  Warnings:

  - Added the required column `RoleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

INSERT INTO "Role" ("name") VALUES ('admin');

-- AlterTable
ALTER TABLE "User" RENAME CONSTRAINT "Admin_pkey" TO "User_pkey";

ALTER TABLE "User" ADD COLUMN "RoleId" INTEGER;

UPDATE "User" SET "RoleId" = (SELECT id FROM "Role" WHERE name = 'admin');

-- Make RoleId required
ALTER TABLE "User" ALTER COLUMN "RoleId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_RoleId_fkey" FOREIGN KEY ("RoleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Admin_email_key" RENAME TO "User_email_key";
