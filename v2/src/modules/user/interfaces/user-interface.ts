import { IUser, UpdateUserInput, CreateUserInput } from "../index.js";

export interface UserRepository {
    findByID(userId: string): Promise<IUser | null>;
    findByEmail(email: string): Promise<IUser | null>;
    registerUser({ email, password, firstName, lastName }: CreateUserInput): Promise<IUser>;
    getUsers(): Promise<IUser[]>;
    deleteUser(userId: string): Promise<IUser | null>;
    updateUser(input: UpdateUserInput): Promise<IUser | null>;
}
