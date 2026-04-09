import { IQueryOptions, ResponsePaginate, ICartRepository, CartModel, ICart } from "../index.js";

export class MongooseCartRepository implements ICartRepository {
    async create(userId: string): Promise<ICart> {
        return await CartModel.create({ cartUser: userId });
    }

    async fetchCarts(query: any, options: any): Promise<ResponsePaginate<ICart>> {
        return await CartModel.paginate(query, options);
    }

    async getCartByUserId(userId: string): Promise<ICart | null> {
        return await CartModel.findOne({ cartUser: userId });
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

    async getCart(query: any): Promise<ICart | null> {
        return await CartModel.findOne(query);
    }
}
