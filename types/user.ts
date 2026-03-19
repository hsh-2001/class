export interface IUser {
    id: string;
    username: string;
    email: string;
    password: string;
    roleId: number;
}

export type ICreateUserDTO = Omit<IUser, 'id'>;

export type IUserDTO = Omit<IUser, 'password'>;