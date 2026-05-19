-- Table: message_threads
CREATE TABLE public.message_threads (
    id text PRIMARY KEY,
    class_id text REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE CASCADE,
    teacher_id text REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE CASCADE,
    student_id text REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    participant_one_user_id text REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    participant_two_user_id text REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE (class_id, teacher_id, student_id),
    UNIQUE (participant_one_user_id, participant_two_user_id)
);

-- Performance indexes
CREATE INDEX message_threads_class_id_idx ON public.message_threads USING btree (class_id);
CREATE INDEX message_threads_teacher_id_idx ON public.message_threads USING btree (teacher_id);
CREATE INDEX message_threads_student_id_idx ON public.message_threads USING btree (student_id);
CREATE INDEX message_threads_participant_one_user_id_idx ON public.message_threads USING btree (participant_one_user_id);
CREATE INDEX message_threads_participant_two_user_id_idx ON public.message_threads USING btree (participant_two_user_id);
