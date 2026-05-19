-- Table: users
CREATE TABLE public.users (
    id text PRIMARY KEY,
    email text NOT NULL,
    password text NOT NULL,
    role public."Role" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    school_id text NOT NULL REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    username text DEFAULT ''::text NOT NULL,
    UNIQUE (email, username, school_id)
);
