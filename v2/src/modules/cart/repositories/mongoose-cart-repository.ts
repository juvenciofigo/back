import { CartRepository, CartModel, ICart } from "../index.js";

export class MongooseCartRepository implements CartRepository {
    async create(userId: string): Promise<ICart> {
        return await CartModel.create({ cartUser: userId });
    }

    async getCarts(): Promise<ICart[]> {
        return await CartModel.find();
    }

    async fetchCartByUser(userId: string) {
        return CartModel.findOne({ cartUser: userId })
            .populate({
                path: "cartItens.productId",
                select: "productName productImage productPrice deliveryEstimate productAvailability",
            })
            .populate("cartItens.variation.color")
            .populate("cartItens.variation.model")
            .populate("cartItens.variation.size")
            .populate("cartItens.variation.material")
            .exec();
    }
}
