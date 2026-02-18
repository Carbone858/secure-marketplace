-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "operationAreas" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[];
