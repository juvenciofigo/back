import mongoose from "mongoose";
import { CartNotFoundError, CartRepository, ICart } from "../index.js";
import { Types } from "mongoose";

interface IVariation {
    color?: Types.ObjectId;
    model?: Types.ObjectId;
    size?: Types.ObjectId;
    material?: Types.ObjectId;
}

interface ICartItemInput {
    productId: Types.ObjectId;
    quantity: number;
    variation?: IVariation;
    deliveryEstimate?: Types.ObjectId;
}

interface AddProductToCartDTO {
    userId: string;
    tempCart?: ICartItemInput[];
    singleItem?: ICartItemInput; // caso não venha array, adiciona um único item
}

export class AddProductToCartService {
    private cartRepository: CartRepository;

    constructor(cartRepository: CartRepository) {
        this.cartRepository = cartRepository;
    }

    private isSameItem(a: ICartItemInput, b: ICartItemInput): boolean {
        return (
            a.productId?.toString() === b.productId?.toString() &&
            a.variation?.color?.toString() === b.variation?.color?.toString() &&
            a.variation?.model?.toString() === b.variation?.model?.toString() &&
            a.variation?.material?.toString() === b.variation?.material?.toString() &&
            a.variation?.size?.toString() === b.variation?.size?.toString() &&
            a.deliveryEstimate?.toString() === b.deliveryEstimate?.toString()
        );
    }

    async execute({ userId, tempCart, singleItem }: AddProductToCartDTO) {
        const cart: ICart | null = await this.cartRepository.fetchCartByUser(userId);

        if (!cart) {
            throw new CartNotFoundError();
        }

        let itemsToAdd: ICartItemInput[] = [];

        if (tempCart && tempCart.length > 0) {
            itemsToAdd = tempCart;
        } else if (singleItem) {
            itemsToAdd = [singleItem];
        }

        for (const item of itemsToAdd) {
            const existingProductIndex = cart.cartItens.findIndex((cartItem) => this.isSameItem(cartItem, item));

            if (existingProductIndex !== -1) {
                cart.cartItens[existingProductIndex].quantity += Number(item.quantity) || 1;
            } else {
                cart.cartItens.push({
                    productId: item.productId,
                    quantity: Number(item.quantity) || 1,
                    variation: {
                        color: item?.variation?.color,
                        model: item?.variation?.model,
                        size: item?.variation?.size,
                        material: item?.variation?.material,
                    },
                    deliveryEstimate: item.deliveryEstimate,
                    item: new mongoose.Types.ObjectId(),
                });
            }
        }

        await cart.save();
        return { message: "Produto(s) adicionado(s) ao carrinho" };
    }
}
