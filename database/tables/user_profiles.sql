-- Table: user_profiles
CREATE TABLE public.user_profiles (
    id text PRIMARY KEY,
    user_id text NOT NULL UNIQUE REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text,
    gender public."Gender" NOT NULL,
    profile_url text
);
