-- AlterEnum
ALTER TYPE "role" ADD VALUE 'COORDINATOR';

-- CreateEnum
CREATE TYPE "application_status" AS ENUM ('NEW', 'TALKING', 'POOL', 'INVITED', 'MEMBER', 'DECLINED', 'WITHDREW');

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "course" TEXT,
    "period" TEXT,
    "skills" TEXT[],
    "interests" TEXT[],
    "hoursPerWeek" INTEGER,
    "portfolioUrl" TEXT,
    "message" TEXT,
    "status" "application_status" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "consentAt" TIMESTAMP(3) NOT NULL,
    "ipHash" TEXT,
    "handledById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "applications_chapterId_status_createdAt_idx" ON "applications"("chapterId", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "applications_ipHash_createdAt_idx" ON "applications"("ipHash", "createdAt");

-- CreateIndex
CREATE INDEX "applications_email_createdAt_idx" ON "applications"("email", "createdAt");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_handledById_fkey" FOREIGN KEY ("handledById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
