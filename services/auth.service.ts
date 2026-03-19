import { ICreateUserDTO, IUser, IUserDTO } from "@/types/user";
import authRepo from "@/repositories/auth.repo";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from 'jsonwebtoken';

const createUser = async (request: ICreateUserDTO) => {
    const existingUser = await getUserByEmail(request.email);
    if (existingUser) {
        throw new Error("email already exists");
    }
    const hashedPassword = await getPasswordHash(request.password);
    await authRepo.createUser({ ...request, password: hashedPassword });
}

const getUserByEmail = async (email: string) => {
    return await authRepo.getUserByEmail(email);
}

const login = async (email: string, password: string): Promise<IUserDTO & {token: string, refreshToken: string}> => {
    const user = await getUserByEmail(email) as IUser;
    if (!user) {
        throw new Error("Invalid email or password");
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }
    const token = await generateToken(user);
    const refreshToken = await generateRefreshToken(user);
    return { ...user, token, refreshToken };
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
        throw new Error('JWT_SECRET is not defined');
    }
    
    const payload = { id: user.id, email: user.email, roleId: user.roleId };
    const options: SignOptions = { expiresIn: '1d' };

  return jwt.sign(payload, secret, options);
}

const generateRefreshToken = async (user: IUserDTO) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    
    const payload = { id: user.id, email: user.email, roleId: user.roleId };
    const options: SignOptions = { expiresIn: '7d' };

  return jwt.sign(payload, secret, options);
}

const verifyToken = async (token: string) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    try {
        return jwt.verify(token, secret);
    } catch {
        throw new Error("Invalid token");
    }
}

export default {
    createUser,
    getUserByEmail,
    comparePassword,
    login,
    generateToken,
    generateRefreshToken,
    verifyToken,
};