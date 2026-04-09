import { IUser, UpdateUserInput, CreateUserInput } from "../index.js";
import { ResponsePaginate } from "../../../shared/interface.js";

export interface IUserRepository {
    getUser(query: Record<string, any>): Promise<IUser | null>;
    registerUser({ email, password, firstName, lastName }: CreateUserInput): Promise<IUser>;
    getUsers(query: any, options: any): Promise<ResponsePaginate<IUser>>;
    deleteUser(userId: string): Promise<IUser | null>;
    updateUser(userId: string, data: Partial<IUser>): Promise<IUser | null>;
}
