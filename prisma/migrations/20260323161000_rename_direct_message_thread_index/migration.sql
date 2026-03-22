DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_class
        WHERE relkind = 'i'
          AND relname = 'message_threads_participant_one_user_id_participant_two_user_id'
    ) AND NOT EXISTS (
        SELECT 1
        FROM pg_class
        WHERE relkind = 'i'
          AND relname = 'message_threads_participant_one_user_id_participant_two_use_key'
    ) THEN
        ALTER INDEX "message_threads_participant_one_user_id_participant_two_user_id"
            RENAME TO "message_threads_participant_one_user_id_participant_two_use_key";
    END IF;
END $$;
