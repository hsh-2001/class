import db from "@/lib/db";
import { IClassListItem, ICreateClassDTO } from "@/types/class";
import { ICreateCourseDTO, IUpdateCourseDTO } from "@/types/course";
import { IUpdateUserDTO } from "@/types/user";

const createStudent = async (userId: string) => {
    const result = await db.query(
        `WITH new_student AS (
            INSERT INTO students (user_id) VALUES ($1) RETURNING *
        )
        SELECT s.*, jsonb_build_object(
            'id', u.id,
            'username', u.username,
            'email', u.email,
            'profile', CASE WHEN up.id IS NOT NULL THEN jsonb_build_object(
                'id', up.id,
                'first_name', up.first_name,
                'last_name', up.last_name,
                'phone', up.phone,
                'gender', up.gender,
                'profile_url', up.profile_url
            ) ELSE NULL END
        ) AS "user"
        FROM new_student s
        JOIN users u ON u.id = s.user_id
        LEFT JOIN user_profiles up ON up.user_id = u.id`,
        [userId]
    );

    return result.rows[0];
};

const getStudents = async () => {
    const result = await db.query(
        `SELECT s.*, jsonb_build_object(
            'id', u.id,
            'username', u.username,
            'email', u.email,
            'role', u.role,
            'created_at', u.created_at,
            'profile', CASE WHEN up.id IS NOT NULL THEN jsonb_build_object(
                'id', up.id,
                'first_name', up.first_name,
                'last_name', up.last_name,
                'phone', up.phone,
                'gender', up.gender,
                'profile_url', up.profile_url
            ) ELSE NULL END
        ) AS "user"
        FROM students s
        JOIN users u ON u.id = s.user_id
        LEFT JOIN user_profiles up ON up.user_id = u.id`
    );

    return result.rows;
};

const updateStudent = async (id: string, data: IUpdateUserDTO) => {
    const studentResult = await db.query(
        `SELECT s.*, u.id AS user_id, up.id AS profile_id
         FROM students s
         JOIN users u ON u.id = s.user_id
         LEFT JOIN user_profiles up ON up.user_id = u.id
         WHERE s.id = $1
         LIMIT 1`,
        [id]
    );

    const currentStudent = studentResult.rows[0];
    if (!currentStudent) {
        throw new Error("STUDENT_NOT_FOUND");
    }

    return await updateUser(currentStudent.userId, currentStudent.profileId, data);
};

const getUserById = async (userId: string) => {
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

const getAllUsers = async () => {
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
                CASE WHEN s.id IS NOT NULL THEN jsonb_build_object('id', s.id, 'user_id', s.user_id) ELSE NULL END AS student,
                CASE WHEN t.id IS NOT NULL THEN jsonb_build_object('id', t.id, 'user_id', t.user_id) ELSE NULL END AS teacher
         FROM users u
         LEFT JOIN user_profiles up ON up.user_id = u.id
         LEFT JOIN students s ON s.user_id = u.id
         LEFT JOIN teachers t ON t.user_id = u.id`
    );

    return result.rows;
};

const createTeacher = async (userId: string) => {
    const result = await db.query(
        `WITH new_teacher AS (
            INSERT INTO teachers (user_id) VALUES ($1) RETURNING *
        )
        SELECT t.*, jsonb_build_object(
            'id', u.id,
            'username', u.username,
            'email', u.email,
            'profile', CASE WHEN up.id IS NOT NULL THEN jsonb_build_object(
                'id', up.id,
                'first_name', up.first_name,
                'last_name', up.last_name,
                'phone', up.phone,
                'gender', up.gender,
                'profile_url', up.profile_url
            ) ELSE NULL END
        ) AS "user"
        FROM new_teacher t
        JOIN users u ON u.id = t.user_id
        LEFT JOIN user_profiles up ON up.user_id = u.id`,
        [userId]
    );

    return result.rows[0];
};

const getAllTeachers = async () => {
    const result = await db.query(
        `SELECT t.*, jsonb_build_object(
            'id', u.id,
            'username', u.username,
            'email', u.email,
            'role', u.role,
            'school_id', u.school_id,
            'profile', CASE WHEN up.id IS NOT NULL THEN jsonb_build_object(
                'id', up.id,
                'first_name', up.first_name,
                'last_name', up.last_name,
                'phone', up.phone,
                'gender', up.gender,
                'profile_url', up.profile_url
            ) ELSE NULL END
        ) AS "user"
        FROM teachers t
        JOIN users u ON u.id = t.user_id
        LEFT JOIN user_profiles up ON up.user_id = u.id`
    );

    return result.rows;
};

const updateTeacher = async (id: string, data: IUpdateUserDTO) => {
    const teacherResult = await db.query(
        `SELECT t.*, u.id AS user_id, up.id AS profile_id
         FROM teachers t
         JOIN users u ON u.id = t.user_id
         LEFT JOIN user_profiles up ON up.user_id = u.id
         WHERE t.id = $1
         LIMIT 1`,
        [id]
    );

    const currentTeacher = teacherResult.rows[0];
    if (!currentTeacher) {
        throw new Error("TEACHER_NOT_FOUND");
    }

    return await updateUser(currentTeacher.userId, currentTeacher.profileId, data);
};

const updateUser = async (userId: string, profileId: string | undefined, data: IUpdateUserDTO) => {
    const { email, username, firstName, lastName, phone, gender } = data;

    // Update user fields
    if (email !== undefined || username !== undefined) {
        const setClauses: string[] = [];
        const params: unknown[] = [];
        let paramIndex = 1;

        if (email !== undefined) {
            setClauses.push(`email = $${paramIndex++}`);
            params.push(email);
        }
        if (username !== undefined) {
            setClauses.push(`username = $${paramIndex++}`);
            params.push(username);
        }

        params.push(userId);
        await db.query(
            `UPDATE users SET ${setClauses.join(", ")} WHERE id = $${paramIndex}`,
            params
        );
    }

    // Upsert profile
    const shouldUpsertProfile =
        firstName !== undefined ||
        lastName !== undefined ||
        phone !== undefined ||
        gender !== undefined;

    if (shouldUpsertProfile) {
        const profileData: Record<string, unknown> = {};
        if (firstName !== undefined) profileData.first_name = firstName;
        if (lastName !== undefined) profileData.last_name = lastName;
        if (phone !== undefined) profileData.phone = phone;
        if (gender !== undefined) profileData.gender = gender;

        const columns = ["user_id", ...Object.keys(profileData)];
        const values = [userId, ...Object.values(profileData)];
        const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
        const updateSet = Object.keys(profileData)
            .map((key) => `${key} = EXCLUDED.${key}`)
            .join(", ");

        await db.query(
            `INSERT INTO user_profiles (${columns.join(", ")})
             VALUES (${placeholders})
             ON CONFLICT (user_id)
             DO UPDATE SET ${updateSet}`,
            values
        );
    }

    // Return updated user
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

    return result.rows[0];
};

const createCourse = async (request: ICreateCourseDTO) => {
    const result = await db.query(
        `INSERT INTO courses (name, code, description, course_banner, school_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [request.name, request.code, request.description, request.courseBanner, request.schoolId]
    );

    return result.rows[0];
};

const updateCourse = async (request: IUpdateCourseDTO) => {
    const setClauses: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (request.name !== undefined) {
        setClauses.push(`name = $${paramIndex++}`);
        params.push(request.name);
    }
    if (request.code !== undefined) {
        setClauses.push(`code = $${paramIndex++}`);
        params.push(request.code);
    }
    if (request.courseBanner !== undefined) {
        setClauses.push(`course_banner = $${paramIndex++}`);
        params.push(request.courseBanner);
    }
    if (request.description !== undefined) {
        setClauses.push(`description = $${paramIndex++}`);
        params.push(request.description);
    }

    params.push(request.id);
    const result = await db.query(
        `UPDATE courses SET ${setClauses.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
        params
    );

    return result.rows[0];
};

const getAllCourses = async (schoolId: string) => {
    const result = await db.query(
        `SELECT * FROM courses WHERE school_id = $1 ORDER BY name ASC`,
        [schoolId]
    );

    return result.rows;
};

const createClass = async (schoolId: string, request: ICreateClassDTO) => {
    const result = await db.query(
        `WITH new_class AS (
            INSERT INTO classes (name, course_id, teacher_id, start_date, end_date, school_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        )
        SELECT cl.*,
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
         FROM new_class cl
         JOIN courses co ON co.id = cl.course_id
         JOIN teachers t ON t.id = cl.teacher_id
         JOIN users u ON u.id = t.user_id
         LEFT JOIN user_profiles up ON up.user_id = u.id`,
        [request.name, request.courseId, request.teacherId, new Date(request.startDate), request.endDate ? new Date(request.endDate) : null, schoolId]
    );

    return result.rows[0];
};

const updateClass = async (id: string, request: Partial<ICreateClassDTO>) => {
    const setClauses: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (request.name !== undefined) {
        setClauses.push(`name = $${paramIndex++}`);
        params.push(request.name);
    }
    if (request.courseId !== undefined) {
        setClauses.push(`course_id = $${paramIndex++}`);
        params.push(request.courseId);
    }
    if (request.teacherId !== undefined) {
        setClauses.push(`teacher_id = $${paramIndex++}`);
        params.push(request.teacherId);
    }
    if (request.startDate !== undefined) {
        setClauses.push(`start_date = $${paramIndex++}`);
        params.push(new Date(request.startDate));
    }
    if (request.endDate !== undefined) {
        setClauses.push(`end_date = $${paramIndex++}`);
        params.push(request.endDate ? new Date(request.endDate) : null);
    }

    params.push(id);
    await db.query(
        `UPDATE classes SET ${setClauses.join(", ")} WHERE id = $${paramIndex}`,
        params
    );

    return undefined;
};

const getAllClasses = async (schoolId: string): Promise<IClassListItem[]> => {
    const result = await db.query(
        `SELECT cl.*,
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
         FROM classes cl
         JOIN courses co ON co.id = cl.course_id
         JOIN teachers t ON t.id = cl.teacher_id
         JOIN users u ON u.id = t.user_id
         LEFT JOIN user_profiles up ON up.user_id = u.id
         WHERE cl.school_id = $1
         ORDER BY cl.start_date ASC`,
        [schoolId]
    );

    return result.rows.map((item: Record<string, unknown>) => {
        const teacherUser = (item.teacher as Record<string, unknown>)?.user as Record<string, unknown> | undefined;
        const teacherProfile = teacherUser?.profile as Record<string, unknown> | null | undefined;
        const course = item.course as Record<string, unknown> | undefined;
        return {
            id: item.id as string,
            name: item.name as string,
            courseId: item.courseId as string,
            teacherId: item.teacherId as string,
            startDate: new Date(item.startDate as string).toISOString(),
            endDate: item.endDate ? new Date(item.endDate as string).toISOString() : null,
            schoolId: (item.schoolId as string) ?? null,
            courseName: (course?.name as string) ?? "",
            courseCode: (course?.code as string) ?? "",
            teacherName: [teacherProfile?.firstName ?? "", teacherProfile?.lastName ?? ""].join(" ").trim() || (teacherUser?.username as string) || (teacherUser?.email as string),
        };
    });
};

const getOverview = async (userId: string) => {
    const result = await db.query("SELECT * FROM get_overview($1::uuid)", [userId]);
    return result.rows[0];
};

const deleteClass = async (id: string) => {
    await db.query("DELETE FROM classes WHERE id = $1", [id]);
    return null;
};

const deleteCourse = async (id: string) => {
    await db.query("DELETE FROM courses WHERE id = $1", [id]);
    return null;
};

const adminRepo = {
    createStudent,
    getStudents,
    updateStudent,
    getUserById,
    getAllUsers,
    getAllTeachers,
    createTeacher,
    updateTeacher,
    createCourse,
    getAllCourses,
    updateCourse,
    createClass,
    getAllClasses,
    updateClass,
    getOverview,
    deleteClass,
    deleteCourse,
};

export default adminRepo;
