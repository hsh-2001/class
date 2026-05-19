import db from "@/lib/db";

const MESSAGE_PAGE_SIZE = 25;

/**
 * Helper to fetch full thread data by any condition (WHERE clause + params).
 * Builds the complete JSON structure matching the old Prisma includes.
 */
const buildThreadQuery = (whereClause: string, params: unknown[] = []) => {
    return db.query(
        `SELECT
            mt.*,
            jsonb_build_object(
                'id', cl.id,
                'name', cl.name,
                'course', jsonb_build_object('id', co.id, 'name', co.name, 'code', co.code),
                'enrollments', COALESCE(
                    (SELECT jsonb_agg(
                        jsonb_build_object(
                            'id', e.id,
                            'student', jsonb_build_object(
                                'id', s.id,
                                'user_id', s.user_id,
                                'user', jsonb_build_object(
                                    'id', eu.id,
                                    'username', eu.username,
                                    'email', eu.email,
                                    'profile', CASE WHEN eup.id IS NOT NULL THEN jsonb_build_object('first_name', eup.first_name, 'last_name', eup.last_name) ELSE NULL END
                                )
                            )
                        )
                    )
                    FROM enrollments e
                    JOIN students s ON s.id = e.student_id
                    JOIN users eu ON eu.id = s.user_id
                    LEFT JOIN user_profiles eup ON eup.user_id = eu.id
                    WHERE e.class_id = cl.id),
                    '[]'::jsonb
                )
            ) AS class,
            CASE WHEN mt.teacher_id IS NOT NULL THEN
                jsonb_build_object(
                    'id', t.id,
                    'user_id', t.user_id,
                    'user', jsonb_build_object(
                        'id', tu.id,
                        'username', tu.username,
                        'email', tu.email,
                        'role', tu.role,
                        'school_id', tu.school_id,
                        'profile', CASE WHEN tup.id IS NOT NULL THEN jsonb_build_object('first_name', tup.first_name, 'last_name', tup.last_name, 'profile_url', tup.profile_url) ELSE NULL END
                    )
                )
            ELSE NULL END AS teacher,
            CASE WHEN mt.student_id IS NOT NULL THEN
                jsonb_build_object(
                    'id', st.id,
                    'user_id', st.user_id,
                    'user', jsonb_build_object(
                        'id', su.id,
                        'username', su.username,
                        'email', su.email,
                        'role', su.role,
                        'school_id', su.school_id,
                        'profile', CASE WHEN sup.id IS NOT NULL THEN jsonb_build_object('first_name', sup.first_name, 'last_name', sup.last_name, 'profile_url', sup.profile_url) ELSE NULL END
                    )
                )
            ELSE NULL END AS student,
            CASE WHEN mt.participant_one_user_id IS NOT NULL THEN
                jsonb_build_object(
                    'id', p1.id,
                    'username', p1.username,
                    'email', p1.email,
                    'role', p1.role,
                    'school_id', p1.school_id,
                    'profile', CASE WHEN p1p.id IS NOT NULL THEN jsonb_build_object('first_name', p1p.first_name, 'last_name', p1p.last_name, 'profile_url', p1p.profile_url) ELSE NULL END
                )
            ELSE NULL END AS participant_one,
            CASE WHEN mt.participant_two_user_id IS NOT NULL THEN
                jsonb_build_object(
                    'id', p2.id,
                    'username', p2.username,
                    'email', p2.email,
                    'role', p2.role,
                    'school_id', p2.school_id,
                    'profile', CASE WHEN p2p.id IS NOT NULL THEN jsonb_build_object('first_name', p2p.first_name, 'last_name', p2p.last_name, 'profile_url', p2p.profile_url) ELSE NULL END
                )
            ELSE NULL END AS participant_two,
            (SELECT COUNT(*) FROM messages m WHERE m.thread_id = mt.id) AS message_count,
            COALESCE(
                (SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', msg.id,
                        'thread_id', msg.thread_id,
                        'sender_user_id', msg.sender_user_id,
                        'content', msg.content,
                        'image_url', msg.image_url,
                        'attachments', msg.attachments,
                        'is_forwarded', msg.is_forwarded,
                        'reply_to_message_id', msg.reply_to_message_id,
                        'created_at', msg.created_at,
                        'sender_user', jsonb_build_object(
                            'id', msgu.id,
                            'username', msgu.username,
                            'email', msgu.email,
                            'role', msgu.role,
                            'profile', CASE WHEN msgup.id IS NOT NULL THEN jsonb_build_object('first_name', msgup.first_name, 'last_name', msgup.last_name, 'profile_url', msgup.profile_url) ELSE NULL END
                        ),
                        'reply_to_message', CASE WHEN rtm.id IS NOT NULL THEN
                            jsonb_build_object(
                                'id', rtm.id,
                                'sender_user_id', rtm.sender_user_id,
                                'content', rtm.content,
                                'attachments', rtm.attachments,
                                'image_url', rtm.image_url,
                                'sender_user', jsonb_build_object(
                                    'id', rtmu.id,
                                    'username', rtmu.username,
                                    'email', rtmu.email,
                                    'profile', CASE WHEN rtmup.id IS NOT NULL THEN jsonb_build_object('first_name', rtmup.first_name, 'last_name', rtmup.last_name, 'profile_url', rtmup.profile_url) ELSE NULL END
                                )
                            )
                        ELSE NULL END
                    )
                    ORDER BY msg.created_at DESC
                    LIMIT ${MESSAGE_PAGE_SIZE}
                )
                FROM messages msg
                JOIN users msgu ON msgu.id = msg.sender_user_id
                LEFT JOIN user_profiles msgup ON msgup.user_id = msgu.id
                LEFT JOIN messages rtm ON rtm.id = msg.reply_to_message_id
                LEFT JOIN users rtmu ON rtmu.id = rtm.sender_user_id
                LEFT JOIN user_profiles rtmup ON rtmup.user_id = rtmu.id
                WHERE msg.thread_id = mt.id),
                '[]'::jsonb
            ) AS messages
         FROM message_threads mt
         LEFT JOIN classes cl ON cl.id = mt.class_id
         LEFT JOIN courses co ON co.id = cl.course_id
         LEFT JOIN teachers t ON t.id = mt.teacher_id
         LEFT JOIN users tu ON tu.id = t.user_id
         LEFT JOIN user_profiles tup ON tup.user_id = tu.id
         LEFT JOIN students st ON st.id = mt.student_id
         LEFT JOIN users su ON su.id = st.user_id
         LEFT JOIN user_profiles sup ON sup.user_id = su.id
         LEFT JOIN users p1 ON p1.id = mt.participant_one_user_id
         LEFT JOIN user_profiles p1p ON p1p.user_id = p1.id
         LEFT JOIN users p2 ON p2.id = mt.participant_two_user_id
         LEFT JOIN user_profiles p2p ON p2p.user_id = p2.id
         ${whereClause}
         ORDER BY mt.updated_at DESC`,
        params
    );
};

const getThreadsBySchool = async (schoolId: string) => {
    const result = await buildThreadQuery(
        `WHERE (cl.school_id = $1 OR (p1.school_id = $1 AND p2.school_id = $1))`,
        [schoolId]
    );

    return result.rows;
};

const getThreadsByUserId = async (userId: string) => {
    const result = await buildThreadQuery(
        `WHERE (
            t.user_id = $1
            OR st.user_id = $1
            OR (mt.student_id IS NULL AND EXISTS (
                SELECT 1 FROM enrollments e
                JOIN students s ON s.id = e.student_id
                WHERE e.class_id = mt.class_id AND s.user_id = $1
            ))
            OR mt.participant_one_user_id = $1
            OR mt.participant_two_user_id = $1
        )`,
        [userId]
    );

    return result.rows;
};

const getSchoolUsers = async (schoolId: string, excludeUserId: string) => {
    const result = await db.query(
        `SELECT u.*,
                jsonb_build_object(
                    'id', up.id,
                    'first_name', up.first_name,
                    'last_name', up.last_name,
                    'profile_url', up.profile_url
                ) AS profile
         FROM users u
         LEFT JOIN user_profiles up ON up.user_id = u.id
         WHERE u.school_id = $1 AND u.id != $2
         ORDER BY u.email ASC`,
        [schoolId, excludeUserId]
    );

    return result.rows;
};

const getTeacherByUserId = async (userId: string) => {
    const result = await db.query(
        "SELECT * FROM teachers WHERE user_id = $1 LIMIT 1",
        [userId]
    );

    return result.rows[0] || null;
};

const getStudentByUserId = async (userId: string) => {
    const result = await db.query(
        "SELECT * FROM students WHERE user_id = $1 LIMIT 1",
        [userId]
    );

    return result.rows[0] || null;
};

const getEnrollmentByClassAndStudent = async (classId: string, studentId: string) => {
    const result = await db.query(
        "SELECT * FROM enrollments WHERE student_id = $1 AND class_id = $2 LIMIT 1",
        [studentId, classId]
    );

    return result.rows[0] || null;
};

const getClassById = async (classId: string) => {
    const result = await db.query(
        `SELECT cl.*, jsonb_build_object('id', t.id, 'user_id', t.user_id) AS teacher
         FROM classes cl
         JOIN teachers t ON t.id = cl.teacher_id
         WHERE cl.id = $1
         LIMIT 1`,
        [classId]
    );

    return result.rows[0] || null;
};

const getThreadByUnique = async (classId: string, teacherId: string, studentId: string) => {
    const result = await buildThreadQuery(
        `WHERE mt.class_id = $1 AND mt.teacher_id = $2 AND mt.student_id = $3`,
        [classId, teacherId, studentId]
    );

    return result.rows[0] || null;
};

const getDirectThreadByParticipants = async (participantOneUserId: string, participantTwoUserId: string) => {
    const result = await buildThreadQuery(
        `WHERE mt.participant_one_user_id = $1 AND mt.participant_two_user_id = $2`,
        [participantOneUserId, participantTwoUserId]
    );

    return result.rows[0] || null;
};

const getThreadById = async (threadId: string) => {
    const result = await buildThreadQuery("WHERE mt.id = $1", [threadId]);
    return result.rows[0] || null;
};

const getMessageById = async (messageId: string) => {
    const result = await db.query(
        `SELECT msg.*,
                jsonb_build_object(
                    'id', msgu.id,
                    'username', msgu.username,
                    'email', msgu.email,
                    'role', msgu.role,
                    'profile', CASE WHEN msgup.id IS NOT NULL THEN jsonb_build_object('first_name', msgup.first_name, 'last_name', msgup.last_name, 'profile_url', msgup.profile_url) ELSE NULL END
                ) AS sender_user,
                CASE WHEN rtm.id IS NOT NULL THEN
                    jsonb_build_object(
                        'id', rtm.id,
                        'sender_user_id', rtm.sender_user_id,
                        'content', rtm.content,
                        'attachments', rtm.attachments,
                        'image_url', rtm.image_url,
                        'sender_user', jsonb_build_object(
                            'id', rtmu.id,
                            'username', rtmu.username,
                            'email', rtmu.email,
                            'profile', CASE WHEN rtmup.id IS NOT NULL THEN jsonb_build_object('first_name', rtmup.first_name, 'last_name', rtmup.last_name, 'profile_url', rtmup.profile_url) ELSE NULL END
                        )
                    )
                ELSE NULL END AS reply_to_message
         FROM messages msg
         JOIN users msgu ON msgu.id = msg.sender_user_id
         LEFT JOIN user_profiles msgup ON msgup.user_id = msgu.id
         LEFT JOIN messages rtm ON rtm.id = msg.reply_to_message_id
         LEFT JOIN users rtmu ON rtmu.id = rtm.sender_user_id
         LEFT JOIN user_profiles rtmup ON rtmup.user_id = rtmu.id
         WHERE msg.id = $1
         LIMIT 1`,
        [messageId]
    );

    return result.rows[0] || null;
};

const getThreadMessagesBefore = async (threadId: string, beforeMessageCreatedAt: Date) => {
    const result = await db.query(
        `SELECT msg.*,
                jsonb_build_object(
                    'id', msgu.id,
                    'username', msgu.username,
                    'email', msgu.email,
                    'role', msgu.role,
                    'profile', CASE WHEN msgup.id IS NOT NULL THEN jsonb_build_object('first_name', msgup.first_name, 'last_name', msgup.last_name, 'profile_url', msgup.profile_url) ELSE NULL END
                ) AS sender_user,
                CASE WHEN rtm.id IS NOT NULL THEN
                    jsonb_build_object(
                        'id', rtm.id,
                        'sender_user_id', rtm.sender_user_id,
                        'content', rtm.content,
                        'attachments', rtm.attachments,
                        'image_url', rtm.image_url,
                        'sender_user', jsonb_build_object(
                            'id', rtmu.id,
                            'username', rtmu.username,
                            'email', rtmu.email,
                            'profile', CASE WHEN rtmup.id IS NOT NULL THEN jsonb_build_object('first_name', rtmup.first_name, 'last_name', rtmup.last_name, 'profile_url', rtmup.profile_url) ELSE NULL END
                        )
                    )
                ELSE NULL END AS reply_to_message
         FROM messages msg
         JOIN users msgu ON msgu.id = msg.sender_user_id
         LEFT JOIN user_profiles msgup ON msgup.user_id = msgu.id
         LEFT JOIN messages rtm ON rtm.id = msg.reply_to_message_id
         LEFT JOIN users rtmu ON rtmu.id = rtm.sender_user_id
         LEFT JOIN user_profiles rtmup ON rtmup.user_id = rtmu.id
         WHERE msg.thread_id = $1 AND msg.created_at < $2
         ORDER BY msg.created_at DESC
         LIMIT ${MESSAGE_PAGE_SIZE}`,
        [threadId, beforeMessageCreatedAt]
    );

    return result.rows;
};

const countThreadMessagesBefore = async (threadId: string, beforeMessageCreatedAt: Date) => {
    const result = await db.query(
        "SELECT COUNT(*)::int AS count FROM messages WHERE thread_id = $1 AND created_at < $2",
        [threadId, beforeMessageCreatedAt]
    );

    return result.rows[0]?.count ?? 0;
};

const createThread = async (classId: string, teacherId: string, studentId: string) => {
    const insertResult = await db.query(
        `INSERT INTO message_threads (class_id, teacher_id, student_id)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [classId, teacherId, studentId]
    );

    return await getThreadById(insertResult.rows[0].id);
};

const createDirectThread = async (participantOneUserId: string, participantTwoUserId: string) => {
    const insertResult = await db.query(
        `INSERT INTO message_threads (participant_one_user_id, participant_two_user_id)
         VALUES ($1, $2)
         RETURNING id`,
        [participantOneUserId, participantTwoUserId]
    );

    return await getThreadById(insertResult.rows[0].id);
};

const getGroupThreadByClassAndTeacher = async (classId: string, teacherId: string) => {
    const result = await buildThreadQuery(
        "WHERE mt.class_id = $1 AND mt.teacher_id = $2 AND mt.student_id IS NULL",
        [classId, teacherId]
    );

    return result.rows[0] || null;
};

const createGroupThread = async (classId: string, teacherId: string) => {
    const insertResult = await db.query(
        `INSERT INTO message_threads (class_id, teacher_id, student_id)
         VALUES ($1, $2, NULL)
         RETURNING id`,
        [classId, teacherId]
    );

    return await getThreadById(insertResult.rows[0].id);
};

const getUserById = async (userId: string) => {
    const result = await db.query(
        `SELECT u.*,
                jsonb_build_object(
                    'id', up.id,
                    'first_name', up.first_name,
                    'last_name', up.last_name,
                    'profile_url', up.profile_url
                ) AS profile,
                CASE WHEN s.id IS NOT NULL THEN jsonb_build_object('id', s.id, 'user_id', s.user_id) ELSE NULL END AS student,
                CASE WHEN t.id IS NOT NULL THEN jsonb_build_object('id', t.id, 'user_id', t.user_id) ELSE NULL END AS teacher
         FROM users u
         LEFT JOIN user_profiles up ON up.user_id = u.id
         LEFT JOIN students s ON s.user_id = u.id
         LEFT JOIN teachers t ON t.user_id = u.id
         WHERE u.id = $1
         LIMIT 1`,
        [userId]
    );

    return result.rows[0] || null;
};

const sendMessage = async (
    threadId: string,
    senderUserId: string,
    content: string,
    imageUrl?: string,
    attachments?: unknown,
    replyToMessageId?: string,
    isForwarded?: boolean,
) => {
    // Insert the message
    await db.query(
        `INSERT INTO messages (thread_id, sender_user_id, content, image_url, attachments, reply_to_message_id, is_forwarded)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
            threadId,
            senderUserId,
            content,
            imageUrl ?? null,
            attachments ? JSON.stringify(attachments) : null,
            replyToMessageId ?? null,
            Boolean(isForwarded),
        ]
    );

    // Update thread timestamp
    await db.query(
        "UPDATE message_threads SET updated_at = NOW() WHERE id = $1",
        [threadId]
    );

    return await getThreadById(threadId);
};

const deleteMessage = async (threadId: string, messageId: string) => {
    // Get the thread's original created_at
    const threadResult = await db.query(
        "SELECT created_at FROM message_threads WHERE id = $1",
        [threadId]
    );

    // Delete the message
    await db.query(
        "DELETE FROM messages WHERE id = $1",
        [messageId]
    );

    // Find latest message's created_at
    const latestMessage = await db.query(
        "SELECT created_at FROM messages WHERE thread_id = $1 ORDER BY created_at DESC LIMIT 1",
        [threadId]
    );

    const latestTimestamp = latestMessage.rows[0]?.created_at ?? threadResult.rows[0]?.created_at ?? new Date();

    // Update thread timestamp
    await db.query(
        "UPDATE message_threads SET updated_at = $1 WHERE id = $2",
        [latestTimestamp, threadId]
    );

    return await getThreadById(threadId);
};

const messageRepo = {
    getThreadsBySchool,
    getThreadsByUserId,
    getSchoolUsers,
    getTeacherByUserId,
    getStudentByUserId,
    getEnrollmentByClassAndStudent,
    getClassById,
    getThreadByUnique,
    getDirectThreadByParticipants,
    getThreadById,
    getMessageById,
    getThreadMessagesBefore,
    countThreadMessagesBefore,
    createThread,
    createDirectThread,
    getGroupThreadByClassAndTeacher,
    createGroupThread,
    getUserById,
    sendMessage,
    deleteMessage,
};

export default messageRepo;
