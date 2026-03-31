import { CartNotFoundError, CartRepository, ICart, ICartItem, ICartItemDetails } from "../index.js";
import { calculateItemPrice } from "../utils/calculateTotal.js";

interface Request {
    userId: string | null;
    body: ICartItem[];
}

export class GetCartDetailsService {
    private cartRepository: CartRepository;

    constructor(cartRepository: CartRepository) {
        this.cartRepository = cartRepository;
    }

    async execute({ userId, body }: Request) {
        let items: ICartItem[];
        let cartProducts: ICartItemDetails[] = [];
        let cartId: string | undefined;

        if (userId) {
            const cart: ICart | null = await this.cartRepository.fetchCartByUser(userId);
            if (!cart) throw new CartNotFoundError();
            if (!cart.cartItens || cart.cartItens.length === 0) return { cartProducts };

            cartId = cart._id?.toString();
            items = cart.cartItens;
        } else {
            items = body || [];
        }

        if (!Array.isArray(items) || items.length === 0) return { cartProducts };

        for (const item of items) {
            const productDetails: any = item.productId;
            if (!productDetails || typeof productDetails === "string") continue;

            const productPrice = calculateItemPrice(productDetails, item.variation, item.deliveryEstimate);
            const subtotal = productPrice * (item.quantity || 1);

            cartProducts.push({
                item: item.item,
                productId: productDetails._id.toString(),
                productName: productDetails.productName,
                picture: productDetails.productImage?.[0] || "",
                variation: item.variation,
                deliveryEstimate: productDetails.deliveryEstimate?.id(item.deliveryEstimate),
                productPrice,
                quantity: Number(item.quantity) || 1,
                subtotal,
            });
        }

        const totalProductsPrice = cartProducts.reduce((total, p) => total + p.subtotal, 0);

        return { totalProducts: totalProductsPrice, items: cartProducts, cartId };
    }
}
