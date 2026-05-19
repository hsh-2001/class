-- Table: message_thread_reads
CREATE TABLE public.message_thread_reads (
    id text PRIMARY KEY,
    thread_id text NOT NULL REFERENCES public.message_threads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    user_id text NOT NULL REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    last_read_message_id text REFERENCES public.messages(id) ON UPDATE CASCADE ON DELETE SET NULL,
    last_read_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    UNIQUE (thread_id, user_id)
);

-- Performance indexes
CREATE INDEX message_thread_reads_user_id_idx ON public.message_thread_reads USING btree (user_id);
CREATE INDEX message_thread_reads_last_read_message_id_idx ON public.message_thread_reads USING btree (last_read_message_id);
