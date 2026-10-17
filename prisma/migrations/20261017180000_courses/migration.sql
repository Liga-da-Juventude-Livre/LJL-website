-- CreateEnum
CREATE TYPE "course_kind" AS ENUM ('TRACK', 'COURSE');

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT,
    "kind" "course_kind" NOT NULL DEFAULT 'TRACK',
    "level" "book_level" NOT NULL DEFAULT 'BEGINNER',
    "durationWeeks" INTEGER,
    "workloadHours" INTEGER,
    "status" "publish_status" NOT NULL DEFAULT 'DRAFT',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "frontId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "body" TEXT,
    "bookId" TEXT,
    "questions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "task" TEXT,
    "estimatedMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "courses_status_sortOrder_idx" ON "courses"("status", "sortOrder");

-- CreateIndex
CREATE INDEX "courses_frontId_idx" ON "courses"("frontId");

-- CreateIndex
CREATE INDEX "lessons_courseId_position_idx" ON "lessons"("courseId", "position");

-- CreateIndex
CREATE INDEX "lessons_bookId_idx" ON "lessons"("bookId");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_frontId_fkey" FOREIGN KEY ("frontId") REFERENCES "fronts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE SET NULL ON UPDATE CASCADE;

