import { CartModel } from "../model/Cart-Model.js";
import { ICart } from "../model/cart-interface-model.js";
import { ICartRepository } from "./cart-interface-repository.js";
import { ResponsePaginate } from "src/shared/interface.js";

export class MongooseCartRepository implements ICartRepository {

    async create(userId: string): Promise<ICart> {
        return await CartModel.create({ cartUser: userId });
    }

    async fetchCarts(query: any, options: any): Promise<ResponsePaginate<ICart>> {
        return await CartModel.paginate(query, options);
    }

    async getCart(query: any): Promise<ICart | null> {
        return await CartModel.findOne(query).populate({
            path: "cartItens.productId",
            select: "productName productImage productPrice deliveryEstimate productAvailability productWeight",
        })
            .populate("cartItens.variation.color")
            .populate("cartItens.variation.model")
            .populate("cartItens.variation.size")
            .populate("cartItens.variation.material")
            .exec();
    }

    async clearCart(cartId: string, options?: any): Promise<boolean> {
        const updated = await CartModel.findByIdAndUpdate(
            cartId,
            { $set: { cartItens: [] } },
            { ...options, new: true }
        );
        return !!updated;
    }
}
