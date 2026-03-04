import { Types } from "mongoose";
import { CartNotFoundError, CartRepository, ICart, IItem, IItemVariation } from "../index.js";

interface Request {
    userId: string | null;
    body: IItem[];
}

interface CartProduct {
    item: Types.ObjectId;
    productId: string;
    productName: string;
    picture: string;
    variation: IItemVariation;
    estimate?: Types.ObjectId;
    productPrice: number;
    quantity: number;
    subtotal: number;
}

export class GetCartDetailsService {
    private cartRepository: CartRepository;

    constructor(cartRepository: CartRepository) {
        this.cartRepository = cartRepository;
    }

    async execute({ userId, body }: Request) {
        let products: IItem[];
        let cartProducts: CartProduct[] = [];
        let cartId: string | undefined;

        if (userId) {
            const cart: ICart | null = await this.cartRepository.fetchCartByUser(userId);

            if (!cart) throw new CartNotFoundError();

            if (!cart.cartItens || cart.cartItens.length === 0) return { cartProducts };

            cartId = cart._id?.toString();
            products = cart.cartItens || [];
        } else {
            products = body;
        }

        if (!Array.isArray(products) || products.length === 0) return { cartProducts };

        for (const product of products) {
            const productDetails: any = product.productId;
            if (!productDetails) continue;

            const estimate = productDetails.deliveryEstimate?.id(product.deliveryEstimate);

            let price = 0;
            const variation: any = product.variation;

            if (estimate?.additionalCost) price += estimate.additionalCost;
            if (variation?.color?.variationPrice) price += variation.color.variationPrice;
            if (variation?.model?.variationPrice) price += variation.model.variationPrice;
            if (variation?.size?.variationPrice) price += variation.size.variationPrice;
            if (variation?.material?.variationPrice) price += variation.material.variationPrice;

            const productPrice = (productDetails.productPrice || 0) + price;
            const subtotal = productPrice * (product.quantity || 1);

            cartProducts.push({
                item: product.item,
                productId: productDetails._id.toString(),
                productName: productDetails.productName,
                picture: productDetails.productImage?.[0] || "",
                variation: {
                    color: variation?.color,
                    model: variation?.model,
                    size: variation?.size,
                    material: variation?.material,
                },
                estimate,
                productPrice,
                quantity: Number(product.quantity) || 1,
                subtotal,
            });
        }

        const totalProductsPrice = cartProducts.reduce((total, product) => total + product.subtotal, 0);

        return { totalProducts: totalProductsPrice, items: cartProducts, cartId };
    }
}
