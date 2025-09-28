import { Types } from "mongoose";
import { CartNotFoundError, CartRepository, ICart } from "../index.js";

interface Request {
    userId: string | null;
    body: unknown[];
}

interface CartProduct {
    item: string;
    productId: string;
    productName: string;
    picture: string;
    variation: {
        color?: Types.ObjectId;
        model?: Types.ObjectId;
        size?: Types.ObjectId;
        material?: Types.ObjectId;
    };
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
        let products = [];
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
            const productDetails = product.productId;
            if (!productDetails) continue;

            const estimate = productDetails.deliveryEstimate?.id(product.deliveryEstimate);

            let price = 0;
            if (estimate?.additionalCost) price += estimate.additionalCost;
            if (product.variation?.color?.variationPrice) price += product.variation.color.variationPrice;
            if (product.variation?.model?.variationPrice) price += product.variation.model.variationPrice;
            if (product.variation?.size?.variationPrice) price += product.variation.size.variationPrice;
            if (product.variation?.material?.variationPrice) price += product.variation.material.variationPrice;

            const productPrice = (productDetails.productPrice || 0) + price;
            const subtotal = productPrice * (product.quantity || 1);

            cartProducts.push({
                item: product.item,
                productId: productDetails._id.toString(),
                productName: productDetails.productName,
                picture: productDetails.productImage?.[0] || "",
                variation: {
                    color: product.variation?.color,
                    model: product.variation?.model,
                    size: product.variation?.size,
                    material: product.variation?.material,
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
