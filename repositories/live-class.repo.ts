import db from "@/lib/db";

const SELECT_LIVE_WITH_COURSE_AND_TEACHER = `SELECT c.*,
    jsonb_build_object('id', co.id, 'name', co.name, 'code', co.code) AS course,
    jsonb_build_object(
        'id', t.id,
        'user_id', t.user_id,
        'user', jsonb_build_object(
            'id', u.id,
            'username', u.username,
            'email', u.email,
            'profile', CASE WHEN up.id IS NOT NULL THEN jsonb_build_object('first_name', up.first_name, 'last_name', up.last_name) ELSE NULL END
        )
    ) AS teacher
FROM classes c
JOIN courses co ON co.id = c.course_id
JOIN teachers t ON t.id = c.teacher_id
JOIN users u ON u.id = t.user_id
LEFT JOIN user_profiles up ON up.user_id = u.id`;

const ORDER_BY_START_DATE_ASC = ` ORDER BY c.start_date ASC`;

const getLiveClassesBySchool = async (schoolId: string) => {
    const result = await db.query(
        SELECT_LIVE_WITH_COURSE_AND_TEACHER + ` WHERE c.school_id = $1` + ORDER_BY_START_DATE_ASC,
        [schoolId]
    );
    return result.rows;
};

const getLiveClassesByTeacherUserId = async (userId: string) => {
    const result = await db.query(
        SELECT_LIVE_WITH_COURSE_AND_TEACHER + ` WHERE t.user_id = $1` + ORDER_BY_START_DATE_ASC,
        [userId]
    );
    return result.rows;
};

const getLiveClassesByStudentUserId = async (userId: string) => {
    const result = await db.query(
        SELECT_LIVE_WITH_COURSE_AND_TEACHER + ` WHERE EXISTS (
             SELECT 1 FROM enrollments e
             JOIN students s ON s.id = e.student_id
             WHERE e.class_id = c.id AND s.user_id = $1
         )` + ORDER_BY_START_DATE_ASC,
        [userId]
    );
    return result.rows;
};

const liveClassRepo = {
    getLiveClassesBySchool,
    getLiveClassesByTeacherUserId,
    getLiveClassesByStudentUserId,
};

export default liveClassRepo;
