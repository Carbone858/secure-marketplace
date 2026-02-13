-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "iconName" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;
