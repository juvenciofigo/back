import { UserRepository } from "./user-interface-repository.js";
import { IUser, UpdateUserInput, UserModel } from "../index.js";
import { CartModel, ICart } from "src/modules/cart/index.js";
import { PaginateResult } from 'mongoose';

export class MongooseUserRepository implements UserRepository {
    async findByID(userId: string): Promise<IUser | null> {
        const user = await UserModel
            .findById(userId)
            .select("-recovery -salt -password -salt ");
        return user;
    }

    async findByEmail(email: string): Promise<IUser | null> {
        const user = await UserModel
            .findOne({
                email: email
            });
        return user;
    }

    async registerUser(data: { email: string; password: string; firstName: string; lastName: string }): Promise<IUser> {
        const user = new UserModel(data);
        const cart: ICart = await CartModel
            .create({
                cartUser: user._id
            });

        user.cart = cart._id;
        await user.save();

        return user;
    }

    async getUsers(page: number, limit: number): Promise<PaginateResult<IUser>> {
        const users = await UserModel
            .paginate({}, {
                select: "-recovery -salt -password -salt",
                page: page,
                limit: limit,
            });
        return users;
    }
    async deleteUser(userId: string): Promise<IUser | null> {
        const user = await UserModel
            .findByIdAndUpdate(
                userId,
                { deleted: true },
                { new: true })
            .select("-recovery -salt -password -deleted");
        return user;
    }

    async updateUser({ userId, email, firstName, lastName, password }: UpdateUserInput): Promise<IUser | null> {
        const update: Partial<IUser> = {};

        if (firstName) update.firstName = firstName.trim();
        if (lastName) update.lastName = lastName.trim();
        if (email) update.email = email.trim().toLowerCase();
        if (password) {
            update.password = password;
        }

        const userUpdated = await UserModel
            .findByIdAndUpdate(
                userId,
                { $set: update },
                { new: true, runValidators: true })
            .lean()
            .select("-recovery -salt -password -deleted");

        if (!userUpdated) return null;

        return userUpdated;
    }
}
