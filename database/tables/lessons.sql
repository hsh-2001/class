-- Table: lessons
CREATE TABLE public.lessons (
    id text PRIMARY KEY,
    title text NOT NULL,
    content text,
    class_id text NOT NULL REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE CASCADE,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    video_url text
);
