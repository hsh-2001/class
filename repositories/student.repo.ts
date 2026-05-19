import db from "@/lib/db";
import { IStudentCourseEnrollmentItem } from "@/types/enrollment";
import type { IUpdateProfileDTO } from "@/types/profile";

const getProfileByUserId = async (userId: string) => {
    const result = await db.query(
        `SELECT u.*,
                jsonb_build_object(
                    'id', up.id,
                    'first_name', up.first_name,
                    'last_name', up.last_name,
                    'phone', up.phone,
                    'gender', up.gender,
                    'profile_url', up.profile_url
                ) AS profile,
                jsonb_build_object('id', s.id, 'name', s.name) AS school
         FROM users u
         LEFT JOIN user_profiles up ON up.user_id = u.id
         LEFT JOIN schools s ON s.id = u.school_id
         WHERE u.id = $1
         LIMIT 1`,
        [userId]
    );
    return result.rows[0] || null;
};

const updateProfile = async (userId: string, request: IUpdateProfileDTO) => {
    // Update user username
    await db.query(
        `UPDATE users SET username = $1 WHERE id = $2`,
        [request.username, userId]
    );

    // Upsert profile
    await db.query(
        `INSERT INTO user_profiles (user_id, first_name, last_name, phone, gender, profile_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (user_id)
         DO UPDATE SET
             first_name = EXCLUDED.first_name,
             last_name = EXCLUDED.last_name,
             phone = EXCLUDED.phone,
             gender = EXCLUDED.gender,
             profile_url = EXCLUDED.profile_url`,
        [
            userId,
            request.firstName,
            request.lastName,
            request.phone ?? null,
            request.gender,
            request.profileUrl ?? null,
        ]
    );

    // Return updated user with profile
    const result = await db.query(
        `SELECT u.*,
                jsonb_build_object(
                    'id', up.id,
                    'first_name', up.first_name,
                    'last_name', up.last_name,
                    'phone', up.phone,
                    'gender', up.gender,
                    'profile_url', up.profile_url
                ) AS profile
         FROM users u
         LEFT JOIN user_profiles up ON up.user_id = u.id
         WHERE u.id = $1
         LIMIT 1`,
        [userId]
    );
    return result.rows[0];
};

const getStudentByUserId = async (userId: string) => {
    const result = await db.query(
        `SELECT s.*,
                jsonb_build_object('id', u.id, 'school_id', u.school_id) AS "user"
         FROM students s
         JOIN users u ON u.id = s.user_id
         WHERE s.user_id = $1
         LIMIT 1`,
        [userId]
    );
    return result.rows[0] || null;
};

const getAvailableCourseEnrollments = async (
    studentId: string,
    schoolId: string,
): Promise<IStudentCourseEnrollmentItem[]> => {
    const result = await db.query(
        `SELECT
             co.id AS course_id,
             co.name AS course_name,
             co.code AS course_code,
             co.description AS course_description,
             co.course_banner AS course_banner,
             cl.id AS class_id,
             cl.name AS class_name,
             cl.start_date,
             cl.end_date,
             CASE WHEN e.id IS NOT NULL THEN true ELSE false END AS is_enrolled,
             e.created_at AS enrolled_at
         FROM courses co
         JOIN classes cl ON cl.course_id = co.id
         LEFT JOIN enrollments e ON e.class_id = cl.id AND e.student_id = $1
         WHERE co.school_id = $2
         ORDER BY co.name, cl.start_date`,
        [studentId, schoolId]
    );

    return result.rows.map((row: Record<string, unknown>) => ({
        courseId: row.courseId as string,
        courseName: row.courseName as string,
        courseCode: row.courseCode as string,
        courseDescription: (row.courseDescription as string) ?? "",
        courseBanner: (row.courseBanner as string) ?? "",
        classId: row.classId as string,
        className: row.className as string,
        startDate: new Date(row.startDate as string).toISOString(),
        endDate: row.endDate ? new Date(row.endDate as string).toISOString() : null,
        isEnrolled: row.isEnrolled as boolean,
        enrolledAt: row.enrolledAt ? new Date(row.enrolledAt as string).toISOString() : null,
    }));
};

const getClassById = async (classId: string, schoolId: string) => {
    const result = await db.query(
        `SELECT cl.*,
                jsonb_build_object('id', t.id, 'user_id', t.user_id) AS teacher
         FROM classes cl
         JOIN teachers t ON t.id = cl.teacher_id
         WHERE cl.id = $1 AND cl.school_id = $2
         LIMIT 1`,
        [classId, schoolId]
    );
    return result.rows[0] || null;
};

const getEnrollmentByStudentAndClass = async (studentId: string, classId: string) => {
    const result = await db.query(
        `SELECT * FROM enrollments WHERE student_id = $1 AND class_id = $2 LIMIT 1`,
        [studentId, classId]
    );
    return result.rows[0] || null;
};

const createEnrollment = async (studentId: string, classId: string) => {
    const result = await db.query(
        `INSERT INTO enrollments (student_id, class_id) VALUES ($1, $2) RETURNING *`,
        [studentId, classId]
    );
    return result.rows[0];
};

const studentRepo = {
    getProfileByUserId,
    updateProfile,
    getStudentByUserId,
    getAvailableCourseEnrollments,
    getClassById,
    getEnrollmentByStudentAndClass,
    createEnrollment,
};

export default studentRepo;
