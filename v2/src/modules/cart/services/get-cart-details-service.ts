import { CartNotFoundError, ICartRepository, ICart, ICartItem } from "../index.js";
import { IProduct, IProductRepository } from "../../product/index.js";
import { formatCartItemSnapshot } from "../utils/cartItemSnapshot.js";



export class GetCartDetailsService {
    private cartRepository: ICartRepository;
    private productRepository: IProductRepository;

    constructor(cartRepository: ICartRepository, productRepository: IProductRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    async execute(userId: string | null, body: ICartItem[]): Promise<any> {
        let items: ICartItem[] = [];
        let cartProducts: any[] = [];
        let cartId: string | undefined;

        if (userId) { // se o usuário estiver autenticado, busca os dados do carrinho no banco de dados

            const cart: ICart | null = await this.cartRepository.fetchCartByUser(userId);
            if (!cart) throw new CartNotFoundError();
            if (!cart.cartItens || cart.cartItens.length === 0) return { totalProducts: 0, items: [], cartId: cart._id?.toString() };

            cartId = cart._id?.toString();
            items = cart.cartItens;
        } else { // se o usuário não estiver autenticado, busca os dados do carrinho no corpo da requisição
            items = body || [];
        }

        if (!Array.isArray(items) || items.length === 0) return { totalProducts: 0, items: [], cartId };

        for (const item of items) {
            let product: IProduct | null = null;
            const productId = item.productId as any;

            // Se productId for apenas uma string (ID), busca os detalhes no banco de dados
            if (typeof productId === "string" || (typeof productId === "object" && !productId.productPrice)) {
                product = await this.productRepository.getProduct(productId.toString());
            } else {
                product = productId;
            }

            if (!product) continue;

            const snapshot = formatCartItemSnapshot({ ...item, productId: product });
            cartProducts.push(snapshot);
        }

        const totalProductsPrice = cartProducts.reduce((total, p) => total + p.subtotal, 0);
        
        return { totalProducts: totalProductsPrice, items: cartProducts, cartId };
    }
}
