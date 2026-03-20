/*
  Warnings:

  - You are about to drop the column `classId` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teacher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[student_id,class_id]` on the table `enrollments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `class_id` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `due_date` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course_id` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacher_id` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_id` to the `enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_id` to the `lessons` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "assignments" DROP CONSTRAINT "assignments_classId_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_courseId_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_classId_fkey";

-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_studentId_fkey";

-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_classId_fkey";

-- DropIndex
DROP INDEX "enrollments_classId_idx";

-- DropIndex
DROP INDEX "enrollments_studentId_classId_key";

-- DropIndex
DROP INDEX "enrollments_studentId_idx";

-- AlterTable
ALTER TABLE "assignments" DROP COLUMN "classId",
DROP COLUMN "createdAt",
DROP COLUMN "dueDate",
ADD COLUMN     "class_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "due_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "courseId",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
DROP COLUMN "teacherId",
ADD COLUMN     "course_id" TEXT NOT NULL,
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "teacher_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "classId",
DROP COLUMN "createdAt",
DROP COLUMN "studentId",
ADD COLUMN     "class_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "student_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "classId",
DROP COLUMN "createdAt",
DROP COLUMN "videoUrl",
ADD COLUMN     "class_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "video_url" TEXT;

-- DropTable
DROP TABLE "Student";

-- DropTable
DROP TABLE "Teacher";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserProfile";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "gender" "Gender" NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_id_key" ON "students"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_user_id_key" ON "teachers"("user_id");

-- CreateIndex
CREATE INDEX "enrollments_student_id_idx" ON "enrollments"("student_id");

-- CreateIndex
CREATE INDEX "enrollments_class_id_idx" ON "enrollments"("class_id");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_student_id_class_id_key" ON "enrollments"("student_id", "class_id");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
