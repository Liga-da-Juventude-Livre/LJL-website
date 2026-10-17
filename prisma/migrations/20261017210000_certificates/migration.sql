-- CreateEnum
CREATE TYPE "certificate_kind" AS ENUM ('COMPLETION', 'PARTICIPATION');

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "issuesCertificate" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "kind" "certificate_kind" NOT NULL DEFAULT 'COMPLETION',
    "recipientName" TEXT NOT NULL,
    "recipientEmail" TEXT,
    "title" TEXT NOT NULL,
    "hours" INTEGER NOT NULL,
    "completedOn" DATE NOT NULL,
    "courseId" TEXT,
    "eventId" TEXT,
    "issuedById" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "revokedReason" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "certificates_code_key" ON "certificates"("code");

-- CreateIndex
CREATE INDEX "certificates_issuedAt_idx" ON "certificates"("issuedAt" DESC);

-- CreateIndex
CREATE INDEX "certificates_courseId_idx" ON "certificates"("courseId");

-- CreateIndex
CREATE INDEX "certificates_eventId_idx" ON "certificates"("eventId");

-- CreateIndex
CREATE INDEX "certificates_recipientEmail_idx" ON "certificates"("recipientEmail");

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

