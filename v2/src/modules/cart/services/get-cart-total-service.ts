import { CartNotFoundError, CartRepository, ICart, ICartItem } from "../index.js";
import calculateTotal from "../utils/calculateTotal.js";

interface Request {
    userId: string | null;
    body?: ICartItem[];
}

export class GetCartTotalService {
    private cartRepository: CartRepository;

    constructor(cartRepository: CartRepository) {
        this.cartRepository = cartRepository;
    }

    async execute({ userId, body }: Request) {
        let items: ICartItem[] = [];

        if (userId) {
            // Utilizador autenticado → busca o carrinho na base de dados
            const cart: ICart | null = await this.cartRepository.fetchCartByUser(userId);

            if (!cart) throw new CartNotFoundError();

            if (!cart.cartItens || cart.cartItens.length === 0) return { total: 0 };

            items = cart.cartItens;
        } else {
            // Não autenticado → usa os itens enviados no body pelo front-end
            if (!Array.isArray(body) || body.length === 0) return { total: 0 };
            items = body;
        }

        const total = calculateTotal(items);

        return { total };
    }
}
