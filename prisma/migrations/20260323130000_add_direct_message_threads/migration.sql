ALTER TABLE "message_threads"
ALTER COLUMN "class_id" DROP NOT NULL,
ALTER COLUMN "teacher_id" DROP NOT NULL;

ALTER TABLE "message_threads"
ADD COLUMN "participant_one_user_id" TEXT,
ADD COLUMN "participant_two_user_id" TEXT;

CREATE UNIQUE INDEX "message_threads_participant_one_user_id_participant_two_user_id_key"
ON "message_threads"("participant_one_user_id", "participant_two_user_id");

CREATE INDEX "message_threads_participant_one_user_id_idx"
ON "message_threads"("participant_one_user_id");

CREATE INDEX "message_threads_participant_two_user_id_idx"
ON "message_threads"("participant_two_user_id");

ALTER TABLE "message_threads"
ADD CONSTRAINT "message_threads_participant_one_user_id_fkey"
FOREIGN KEY ("participant_one_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "message_threads"
ADD CONSTRAINT "message_threads_participant_two_user_id_fkey"
FOREIGN KEY ("participant_two_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
