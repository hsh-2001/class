-- DropForeignKey
ALTER TABLE "message_threads" DROP CONSTRAINT "message_threads_student_id_fkey";

-- AddForeignKey
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;
