-- CreateIndex
CREATE INDEX "companies_countryId_idx" ON "companies"("countryId");

-- CreateIndex
CREATE INDEX "companies_cityId_idx" ON "companies"("cityId");

-- CreateIndex
CREATE INDEX "companies_verificationStatus_idx" ON "companies"("verificationStatus");

-- CreateIndex
CREATE INDEX "companies_isActive_idx" ON "companies"("isActive");

-- CreateIndex
CREATE INDEX "companies_isFeatured_idx" ON "companies"("isFeatured");

-- CreateIndex
CREATE INDEX "companies_rating_idx" ON "companies"("rating");

-- CreateIndex
CREATE INDEX "companies_createdAt_idx" ON "companies"("createdAt");
