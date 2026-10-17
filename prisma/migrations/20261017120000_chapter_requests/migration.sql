-- CreateEnum
CREATE TYPE "request_status" AS ENUM ('NEW', 'CONTACTED', 'STARTED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "chapter_requests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "universityKey" TEXT NOT NULL,
    "course" TEXT,
    "message" TEXT,
    "status" "request_status" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "consentAt" TIMESTAMP(3) NOT NULL,
    "ipHash" TEXT,
    "handledById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapter_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chapter_requests_status_createdAt_idx" ON "chapter_requests"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "chapter_requests_universityKey_status_idx" ON "chapter_requests"("universityKey", "status");

-- CreateIndex
CREATE INDEX "chapter_requests_ipHash_createdAt_idx" ON "chapter_requests"("ipHash", "createdAt");

-- CreateIndex
CREATE INDEX "chapter_requests_email_createdAt_idx" ON "chapter_requests"("email", "createdAt");

-- AddForeignKey
ALTER TABLE "chapter_requests" ADD CONSTRAINT "chapter_requests_handledById_fkey" FOREIGN KEY ("handledById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

