-- Table: teachers
CREATE TABLE public.teachers (
    id text PRIMARY KEY,
    user_id text NOT NULL UNIQUE REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT
);
