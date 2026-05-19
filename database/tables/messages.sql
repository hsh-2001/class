-- Table: messages
CREATE TABLE public.messages (
    id text PRIMARY KEY,
    thread_id text NOT NULL REFERENCES public.message_threads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    sender_user_id text NOT NULL REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    content text DEFAULT ''::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    image_url text,
    attachments jsonb,
    reply_to_message_id text REFERENCES public.messages(id) ON UPDATE CASCADE ON DELETE SET NULL,
    is_forwarded boolean DEFAULT false NOT NULL
);

-- Performance indexes
CREATE INDEX messages_thread_id_idx ON public.messages USING btree (thread_id);
CREATE INDEX messages_sender_user_id_idx ON public.messages USING btree (sender_user_id);
CREATE INDEX messages_reply_to_message_id_idx ON public.messages USING btree (reply_to_message_id);
