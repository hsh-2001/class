-- Table: enrollments
CREATE TABLE public.enrollments (
    id text PRIMARY KEY,
    grade text,
    class_id text NOT NULL REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE CASCADE,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    student_id text NOT NULL REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    UNIQUE (student_id, class_id)
);

-- Performance indexes
CREATE INDEX enrollments_class_id_idx ON public.enrollments USING btree (class_id);
CREATE INDEX enrollments_student_id_idx ON public.enrollments USING btree (student_id);
