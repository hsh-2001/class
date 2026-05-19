-- Table: classes
CREATE TABLE public.classes (
    id text PRIMARY KEY,
    name text NOT NULL,
    course_id text NOT NULL REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    end_date timestamp(3) without time zone,
    start_date timestamp(3) without time zone NOT NULL,
    teacher_id text NOT NULL REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    "schoolId" text REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE SET NULL
);
