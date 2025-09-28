import { Document, Types } from "mongoose";

interface IRecovery {
    token?: string | null;
    date?: Date | null;
}

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    profilePhoto?: string;
    password: string;
    email: string;
    role: string[];
    customer?: Types.ObjectId;
    cart?: unknown;
    deleted: boolean;
    hash?: string;
    salt?: string;
    OTP?: number;
    recovery?: IRecovery;
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
