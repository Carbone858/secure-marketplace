-- CreateEnum
CREATE TYPE "HealthStatus" AS ENUM ('OK', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "HealthCategory" AS ENUM ('API', 'DATABASE', 'CACHE', 'AUTH', 'REQUESTS', 'MESSAGING', 'UPLOADS', 'SECURITY');

-- AlterTable
ALTER TABLE "feature_flags" ADD COLUMN     "descriptionAr" TEXT,
ADD COLUMN     "isDynamic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "nameAr" TEXT,
ADD COLUMN     "nameEn" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "completedByCompany" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "completedByUser" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "flag_audit_logs" (
    "id" TEXT NOT NULL,
    "flagId" TEXT NOT NULL,
    "flagKey" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "adminName" TEXT,
    "prevValue" BOOLEAN NOT NULL,
    "newValue" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flag_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_logs" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "category" "HealthCategory" NOT NULL,
    "status" "HealthStatus" NOT NULL,
    "latencyMs" INTEGER,
    "statusCode" INTEGER,
    "errorMessage" TEXT,
    "url" TEXT,
    "details" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL DEFAULT 'synthetic',
    "testedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_states" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "lastAlertAt" TIMESTAMP(3),
    "isSuppressed" BOOLEAN NOT NULL DEFAULT false,
    "failCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alert_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sla_reports" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "uptimePercent" DOUBLE PRECISION NOT NULL,
    "totalChecks" INTEGER NOT NULL,
    "failedChecks" INTEGER NOT NULL,
    "downtimeMinutes" INTEGER NOT NULL,
    "avgLatencyMs" INTEGER NOT NULL,
    "incidentsByCategory" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sla_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_audit_logs" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "flag_audit_logs_flagId_idx" ON "flag_audit_logs"("flagId");

-- CreateIndex
CREATE INDEX "flag_audit_logs_adminId_idx" ON "flag_audit_logs"("adminId");

-- CreateIndex
CREATE INDEX "flag_audit_logs_createdAt_idx" ON "flag_audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "health_logs_testedAt_idx" ON "health_logs"("testedAt");

-- CreateIndex
CREATE INDEX "health_logs_category_status_idx" ON "health_logs"("category", "status");

-- CreateIndex
CREATE INDEX "health_logs_source_idx" ON "health_logs"("source");

-- CreateIndex
CREATE UNIQUE INDEX "alert_states_service_key" ON "alert_states"("service");

-- CreateIndex
CREATE INDEX "sla_reports_year_month_idx" ON "sla_reports"("year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "sla_reports_year_month_key" ON "sla_reports"("year", "month");

-- CreateIndex
CREATE INDEX "project_audit_logs_requestId_idx" ON "project_audit_logs"("requestId");

-- CreateIndex
CREATE INDEX "project_audit_logs_adminId_idx" ON "project_audit_logs"("adminId");

-- CreateIndex
CREATE INDEX "project_audit_logs_createdAt_idx" ON "project_audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "flag_audit_logs" ADD CONSTRAINT "flag_audit_logs_flagId_fkey" FOREIGN KEY ("flagId") REFERENCES "feature_flags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
