import { CartNotFoundError, ICartRepository, ICart, ICartItem } from "../index.js";
import { IProductRepository } from "../../product/index.js";
import calculateTotal from "../utils/calculateTotal.js";

interface Request {
    userId: string | null;
    body?: ICartItem[];
}

export class GetCartTotalService {
    private cartRepository: ICartRepository;
    private productRepository: IProductRepository;

    constructor(cartRepository: ICartRepository, productRepository: IProductRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    async execute({ userId, body }: Request) {
        let items: ICartItem[] = [];

        if (userId) {
            // Utilizador autenticado → busca o carrinho na base de dados (já vem populado pelo repositório)
            const cart: ICart | null = await this.cartRepository.fetchCartByUser(userId);

            if (!cart) throw new CartNotFoundError();

            if (!cart.cartItens || cart.cartItens.length === 0) return { total: 0 };

            items = cart.cartItens;
        } else {
            // Não autenticado → usa os itens enviados no body pelo front-end
            if (!Array.isArray(body) || body.length === 0) return { total: 0 };
            
            // Precisamos buscar os detalhes de cada produto para ter acesso aos preços reais
            const guestItems = [];
            for (const item of body) {
                const productDetails = await this.productRepository.getProduct({ _id: item.productId });
                if (productDetails) {
                    guestItems.push({
                        ...item,
                        productId: productDetails as any // calculateTotal espera o objeto populado
                    });
                }
            }
            items = guestItems;
        }

        const total = calculateTotal(items);

        return { total };
    }
}
