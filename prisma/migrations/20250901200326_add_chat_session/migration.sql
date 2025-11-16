-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "GardenType" AS ENUM ('OPEN_AIR', 'GREENHOUSE', 'GLASSHOUSE');

-- CreateEnum
CREATE TYPE "PlotStatus" AS ENUM ('EMPTY', 'PLANTED', 'GROWING', 'HARVEST_READY');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('LEASE', 'PLANTING', 'WATERING', 'FERTILIZING', 'PEST_CONTROL', 'WEEDING', 'HARVEST');

-- CreateEnum
CREATE TYPE "Sender" AS ENUM ('USER', 'BOT', 'PRODUCER');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "avatar" TEXT,
    "street" TEXT,
    "city" TEXT,
    "zipCode" TEXT,
    "roles" "Roles"[] DEFAULT ARRAY['USER']::"Roles"[],
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "producerId" UUID,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryAddress" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,

    CONSTRAINT "DeliveryAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specialty" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "userId" UUID,

    CONSTRAINT "Producer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vegetable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "icon" TEXT,
    "plantableMonths" INTEGER[],
    "temperature" DOUBLE PRECISION,
    "harvestMonths" INTEGER[],
    "companions" TEXT[],
    "incompatible" TEXT[],
    "facts" TEXT,
    "category" TEXT,
    "backgroundImage" TEXT,
    "growthTime" TEXT,
    "season" TEXT,
    "water" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Vegetable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthStage" (
    "id" TEXT NOT NULL,
    "vegetableId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "days" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "GrowthStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plot" (
    "id" SERIAL NOT NULL,
    "gardenId" TEXT NOT NULL,
    "status" "PlotStatus" NOT NULL DEFAULT 'EMPTY',
    "vegetableId" TEXT,
    "healthScore" INTEGER,
    "plantedDate" TIMESTAMP(3),
    "progress" INTEGER,

    CONSTRAINT "Plot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Garden" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "leaseDate" TIMESTAMP(3) NOT NULL,
    "userId" UUID,
    "cameraUrl" TEXT,
    "templateId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Garden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GardenTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "GardenType" NOT NULL,
    "location" TEXT,
    "cameraUrlTemplate" TEXT,
    "price" DECIMAL(65,30),
    "producerId" TEXT,
    "maxInstances" INTEGER NOT NULL DEFAULT 1,
    "defaultPlots" INTEGER NOT NULL DEFAULT 9,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "GardenTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GardenVegetable" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "vegetableId" TEXT NOT NULL,

    CONSTRAINT "GardenVegetable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "gardenId" TEXT NOT NULL,
    "userId" UUID,
    "type" "ActivityType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "comment" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "producerId" TEXT,
    "gardenId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "sender" "Sender" NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "gardenId" TEXT NOT NULL,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DeliveryAddress_userId_idx" ON "DeliveryAddress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Producer_userId_key" ON "Producer"("userId");

-- CreateIndex
CREATE INDEX "GrowthStage_vegetableId_idx" ON "GrowthStage"("vegetableId");

-- CreateIndex
CREATE INDEX "Plot_gardenId_idx" ON "Plot"("gardenId");

-- CreateIndex
CREATE INDEX "Plot_vegetableId_idx" ON "Plot"("vegetableId");

-- CreateIndex
CREATE INDEX "Garden_userId_idx" ON "Garden"("userId");

-- CreateIndex
CREATE INDEX "Garden_templateId_idx" ON "Garden"("templateId");

-- CreateIndex
CREATE INDEX "GardenTemplate_producerId_idx" ON "GardenTemplate"("producerId");

-- CreateIndex
CREATE INDEX "GardenVegetable_templateId_idx" ON "GardenVegetable"("templateId");

-- CreateIndex
CREATE INDEX "GardenVegetable_vegetableId_idx" ON "GardenVegetable"("vegetableId");

-- CreateIndex
CREATE UNIQUE INDEX "GardenVegetable_templateId_vegetableId_key" ON "GardenVegetable"("templateId", "vegetableId");

-- CreateIndex
CREATE INDEX "Activity_gardenId_idx" ON "Activity"("gardenId");

-- CreateIndex
CREATE INDEX "Activity_userId_idx" ON "Activity"("userId");

-- CreateIndex
CREATE INDEX "ChatSession_userId_idx" ON "ChatSession"("userId");

-- CreateIndex
CREATE INDEX "ChatSession_producerId_idx" ON "ChatSession"("producerId");

-- CreateIndex
CREATE INDEX "ChatSession_gardenId_idx" ON "ChatSession"("gardenId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatSession_userId_producerId_gardenId_key" ON "ChatSession"("userId", "producerId", "gardenId");

-- CreateIndex
CREATE INDEX "ChatMessage_sessionId_idx" ON "ChatMessage"("sessionId");

-- CreateIndex
CREATE INDEX "ChatMessage_userId_idx" ON "ChatMessage"("userId");

-- AddForeignKey
ALTER TABLE "DeliveryAddress" ADD CONSTRAINT "DeliveryAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producer" ADD CONSTRAINT "Producer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthStage" ADD CONSTRAINT "GrowthStage_vegetableId_fkey" FOREIGN KEY ("vegetableId") REFERENCES "Vegetable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plot" ADD CONSTRAINT "Plot_gardenId_fkey" FOREIGN KEY ("gardenId") REFERENCES "Garden"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plot" ADD CONSTRAINT "Plot_vegetableId_fkey" FOREIGN KEY ("vegetableId") REFERENCES "Vegetable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Garden" ADD CONSTRAINT "Garden_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Garden" ADD CONSTRAINT "Garden_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "GardenTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GardenTemplate" ADD CONSTRAINT "GardenTemplate_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GardenVegetable" ADD CONSTRAINT "GardenVegetable_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "GardenTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GardenVegetable" ADD CONSTRAINT "GardenVegetable_vegetableId_fkey" FOREIGN KEY ("vegetableId") REFERENCES "Vegetable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_gardenId_fkey" FOREIGN KEY ("gardenId") REFERENCES "Garden"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_gardenId_fkey" FOREIGN KEY ("gardenId") REFERENCES "Garden"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_gardenId_fkey" FOREIGN KEY ("gardenId") REFERENCES "Garden"("id") ON DELETE CASCADE ON UPDATE CASCADE;
