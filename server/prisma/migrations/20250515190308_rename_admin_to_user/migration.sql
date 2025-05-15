-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(255) NOT NULL,
    "hash" TEXT NOT NULL,
    "hashedRt" TEXT,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatentType" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "PatentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnologyField" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "TechnologyField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patent" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patentNumber" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "dateOfRegistration" TIMESTAMP(3) NOT NULL,
    "dateOfExpiration" TIMESTAMP(3) NOT NULL,
    "contact" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL,
    "patentLink" TEXT NOT NULL,
    "PatentTypeId" INTEGER NOT NULL,
    "TechnologyFieldId" INTEGER NOT NULL,

    CONSTRAINT "Patent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PatentType_name_key" ON "PatentType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TechnologyField_name_key" ON "TechnologyField"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Patent_patentNumber_key" ON "Patent"("patentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Patent_patentLink_key" ON "Patent"("patentLink");

-- AddForeignKey
ALTER TABLE "Patent" ADD CONSTRAINT "Patent_PatentTypeId_fkey" FOREIGN KEY ("PatentTypeId") REFERENCES "PatentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patent" ADD CONSTRAINT "Patent_TechnologyFieldId_fkey" FOREIGN KEY ("TechnologyFieldId") REFERENCES "TechnologyField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
