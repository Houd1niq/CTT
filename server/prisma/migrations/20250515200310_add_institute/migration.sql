/*
  Warnings:

  - Added the required column `InstituteId` to the `Patent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patent"
    ADD COLUMN "InstituteId" INTEGER;

-- AlterTable
ALTER TABLE "User"
    ADD COLUMN "InstituteId" INTEGER;

-- CreateTable
CREATE TABLE "Institute"
(
    "id"        SERIAL       NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name"      VARCHAR(255) NOT NULL,

    CONSTRAINT "Institute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Institute_name_key" ON "Institute" ("name");

INSERT INTO "Institute" ("name")
VALUES ('Default Institute');

UPDATE "Patent"
SET "InstituteId" = (SELECT id FROM "Institute" WHERE name = 'Default Institute');

ALTER TABLE "Patent"
    ALTER COLUMN "InstituteId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User"
    ADD CONSTRAINT "User_InstituteId_fkey" FOREIGN KEY ("InstituteId") REFERENCES "Institute" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patent"
    ADD CONSTRAINT "Patent_InstituteId_fkey" FOREIGN KEY ("InstituteId") REFERENCES "Institute" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
