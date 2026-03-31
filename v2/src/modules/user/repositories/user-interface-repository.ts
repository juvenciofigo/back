import { IUser, UpdateUserInput, CreateUserInput } from "../index.js";
import { ResponsePaginate } from "../../../shared/interface.js";

export interface UserRepository {
    findByID(userId: string): Promise<IUser | null>;
    findByEmail(email: string): Promise<IUser | null>;
    registerUser({ email, password, firstName, lastName }: CreateUserInput): Promise<IUser>;
    getUsers(page: number, limit: number): Promise<ResponsePaginate<IUser>>;
    deleteUser(userId: string): Promise<IUser | null>;
    updateUser(input: UpdateUserInput): Promise<IUser | null>;
}
