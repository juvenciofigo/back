import { IUserRepository } from "./user-interface-repository.js";
import { IUser, UserModel } from "../index.js";
import { CartModel, ICart } from "../../cart/index.js";

export class MongooseUserRepository implements IUserRepository {
    async getUser(query: Record<string, any>): Promise<IUser | null> {
        const user = await UserModel
            .findOne(query)
            .select("-recovery -salt -password");
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

    async getUsers(query: any, options: any): Promise<any> {
        const users = await UserModel
            .paginate(query, {
                ...options,
                select: "-recovery -salt -password",
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

    async updateUser(userId: string, data: Partial<IUser>): Promise<IUser | null> {


        return await UserModel
            .findByIdAndUpdate(
                userId,
                { $set: data },
                { new: true, runValidators: true })
            .lean()
            .select("-recovery -salt -password -deleted");

    }
}
