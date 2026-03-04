import { CartNotFoundError, CartRepository, ICart, IItem } from "../index.js";

interface Request {
    userId: string | null;
    body: IItem[];
}

export class GetCartTotalService {
    private cartRepository: CartRepository;

    constructor(cartRepository: CartRepository) {
        this.cartRepository = cartRepository;
    }

    async execute({ userId, body }: Request) {
        let products: IItem[] = [];

        if (userId) {
            // Utilizador logado → busca o carrinho na base de dados
            const cart: ICart | null = await this.cartRepository.fetchCartByUser(userId);

            if (!cart) throw new CartNotFoundError();

            if (!cart.cartItens || cart.cartItens.length === 0) return { total: 0 };

            products = cart.cartItens;
        } else {
            // Não logado → usa os itens enviados no body pelo front-end
            if (!Array.isArray(body) || body.length === 0) return { total: 0 };
            products = body;
        }

        let totalProductsPrice = 0;

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

            totalProductsPrice += subtotal;
        }

        return { total: totalProductsPrice };
    }
}
