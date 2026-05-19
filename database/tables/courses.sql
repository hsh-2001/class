-- Table: courses
CREATE TABLE public.courses (
    id text PRIMARY KEY,
    name text NOT NULL,
    code text NOT NULL UNIQUE,
    description text,
    "schoolId" text REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE SET NULL,
    course_banner text
);
