import db from "@/lib/db";

const SELECT_WITH_CLASS_BY_SCHOOL = `SELECT a.*,
    jsonb_build_object(
        'id', cl.id,
        'name', cl.name,
        'course', jsonb_build_object('id', co.id, 'name', co.name, 'code', co.code),
        'teacher', jsonb_build_object('id', t.id, 'user_id', t.user_id)
    ) AS class
FROM assignments a
JOIN classes cl ON cl.id = a.class_id
JOIN courses co ON co.id = cl.course_id
JOIN teachers t ON t.id = cl.teacher_id`;

const ORDER_BY_DUE_DATE_ASC = ` ORDER BY a.due_date ASC`;

const SELECT_WITH_COURSE = `SELECT cl.*,
    jsonb_build_object('id', co.id, 'name', co.name, 'code', co.code) AS course
FROM classes cl
JOIN courses co ON co.id = cl.course_id`;

const ORDER_BY_CLASS_START_DATE_ASC = ` ORDER BY cl.start_date ASC`;

const SELECT_ID_WITH_TEACHER = `SELECT cl.*,
    jsonb_build_object('id', t.id, 'user_id', t.user_id) AS teacher
FROM classes cl
JOIN teachers t ON t.id = cl.teacher_id
WHERE cl.id = $1
LIMIT 1`;

const INSERT_WITH_RETURN = `INSERT INTO assignments (class_id, title, due_date) VALUES ($1, $2, $3) RETURNING *`;

const getAssignmentsBySchool = async (schoolId: string) => {
    const result = await db.query(
        SELECT_WITH_CLASS_BY_SCHOOL + ` WHERE cl.school_id = $1` + ORDER_BY_DUE_DATE_ASC,
        [schoolId]
    );
    return result.rows;
};

const getAssignmentsByTeacherUserId = async (userId: string) => {
    const result = await db.query(
        SELECT_WITH_CLASS_BY_SCHOOL + ` WHERE t.user_id = $1` + ORDER_BY_DUE_DATE_ASC,
        [userId]
    );
    return result.rows;
};

const getAssignmentsByStudentUserId = async (userId: string) => {
    const result = await db.query(
        SELECT_WITH_CLASS_BY_SCHOOL + ` WHERE EXISTS (
             SELECT 1 FROM enrollments e
             JOIN students s ON s.id = e.student_id
             WHERE e.class_id = cl.id AND s.user_id = $1
         )` + ORDER_BY_DUE_DATE_ASC,
        [userId]
    );
    return result.rows;
};

const getClassOptionsBySchool = async (schoolId: string) => {
    const result = await db.query(
        SELECT_WITH_COURSE + ` WHERE cl.school_id = $1` + ORDER_BY_CLASS_START_DATE_ASC,
        [schoolId]
    );
    return result.rows;
};

const getClassOptionsByTeacherUserId = async (userId: string) => {
    const result = await db.query(
        SELECT_WITH_COURSE + ` JOIN teachers t ON t.id = cl.teacher_id
         WHERE t.user_id = $1` + ORDER_BY_CLASS_START_DATE_ASC,
        [userId]
    );
    return result.rows;
};

const getClassById = async (classId: string) => {
    const result = await db.query(SELECT_ID_WITH_TEACHER, [classId]);
    return result.rows[0] || null;
};

const createAssignment = async (request: { classId: string; title: string; dueDate: string }) => {
    const result = await db.query(INSERT_WITH_RETURN, [request.classId, request.title, new Date(request.dueDate)]);
    return result.rows[0];
};

const assignmentRepo = {
    getAssignmentsBySchool,
    getAssignmentsByTeacherUserId,
    getAssignmentsByStudentUserId,
    getClassOptionsBySchool,
    getClassOptionsByTeacherUserId,
    getClassById,
    createAssignment,
};

export default assignmentRepo;
