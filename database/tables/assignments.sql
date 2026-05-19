-- Table: assignments
CREATE TABLE public.assignments (
    id text PRIMARY KEY,
    title text NOT NULL,
    class_id text NOT NULL REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE CASCADE,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    due_date timestamp(3) without time zone NOT NULL
);
