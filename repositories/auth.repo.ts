import db from "@/lib/db";
import { ICreateUserDTO } from "@/types/user";

const createUser = async (user: ICreateUserDTO) => {
    if (!user.schoolId) {
        throw new Error("MISSING_SCHOOL_ID");
    }

    const result = await db.query(
        `INSERT INTO users (school_id, email, password, role, username)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [user.schoolId, user.email, user.password, user.role, user.username ?? ""]
    );

    const newUser = result.rows[0];

    if (user.firstName && user.lastName && user.gender) {
        await db.query(
            `INSERT INTO user_profiles (user_id, first_name, last_name, phone, gender)
             VALUES ($1, $2, $3, $4, $5)`,
            [newUser.id, user.firstName, user.lastName, user.phone ?? null, user.gender]
        );
    }

    // Fetch the full user with relations
    const fullUser = await db.query(
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
        [newUser.id]
    );
    return fullUser.rows[0];
};

const getUserByEmail = async (email: string) => {
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
         WHERE u.email = $1
         LIMIT 1`,
        [email]
    );
    return result.rows[0] || null;
};

const authRepo = {
    createUser,
    getUserByEmail,
};

export default authRepo;
