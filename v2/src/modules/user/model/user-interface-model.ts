import { Document, Types } from "mongoose";

interface IRecovery {
    token?: string | null;
    date?: Date | null;
}

export interface IUser extends Document {
    email: string;
    password: string;
    role: string[];
    customer?: Types.ObjectId;
    cart?: unknown;
    hash?: string;
    salt?: string;
    OTP?: number;
    recovery?: IRecovery;
    deleted: boolean;
    gerTokenRecoveryPass(): IRecovery;
    finalTokenRecoveryPass(): IRecovery;
}

export interface UpdateUserInput {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
export interface CreateUserInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
