-- Table: course_materials
CREATE TABLE public.course_materials (
    id text PRIMARY KEY,
    course_id text NOT NULL REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    title text NOT NULL,
    content text,
    video_url text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);
