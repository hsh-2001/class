import { Role } from "@/prisma/generated/enums";
import authRepo from "@/repositories/auth.repo";
import { ICreateUserDTO, IUser, IUserDTO } from "@/types/user";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";

const createUser = async (request: ICreateUserDTO) => {
    const existingUser = await getUserByEmail(request.email);
    if (existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const hashedPassword = await getPasswordHash(request.password);
    return await authRepo.createUser({ ...request, password: hashedPassword });
}

const getUserByEmail = async (email: string) => {
    return await authRepo.getUserByEmail(email);
}

const login = async (
    email: string,
    password: string
): Promise<IUserDTO & { token: string, refreshToken: string }> => {
    const user = await getUserByEmail(email) as IUser | null;
    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const token = await generateToken(user);
    const refreshToken = await generateRefreshToken(user);
    const filterUser = {
        email: user.email,
        username: user.username,
        id: user.id,
        role: user.role,
        schoolId: user.schoolId,
    }
    return { ...filterUser, token, refreshToken };
}

const getPasswordHash = async (password: string) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
}

const generateToken = async (user: IUserDTO) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    const payload = { id: user.id, email: user.email, role: user.role, schoolId: user.schoolId };
    const options: SignOptions = { expiresIn: "1d" };

    return jwt.sign(payload, secret, options);
}

const generateRefreshToken = async (user: IUserDTO) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    const payload = { id: user.id, email: user.email, role: user.role, schoolId: user.schoolId };
    const options: SignOptions = { expiresIn: "7d" };

    return jwt.sign(payload, secret, options);
}

const verifyToken = (token: string) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("MISSING_SECRET");
    }
    try {
        return jwt.verify(token, secret);
    } catch {
        throw new Error("INVALID_TOKEN");
    }
}

const createStudentUser = async (request: Omit<ICreateUserDTO, "role">) => {
    return await createUser({
        ...request,
        role: Role.STUDENT,
    });
}

const createTeacher = async (request: ICreateUserDTO) => {
    return await createUser({
        ...request,
        role: Role.TEACHER,
    });
}

const authService = {
    createUser,
    createStudentUser,
    createTeacher,
    getUserByEmail,
    comparePassword,
    login,
    generateToken,
    generateRefreshToken,
    verifyToken,
};

export default authService;
