import { CartItemNotFoundError, CartNotFoundError, CartRepository, ICart } from "../index.js";

interface Request {
    userId: string;
    item: string;
}

export class RemoveProductToCartService {
    private cartRepository: CartRepository;

    constructor(cartRepository: CartRepository) {
        this.cartRepository = cartRepository;
    }

    async execute({ userId, item }: Request) {
        const cart: ICart | null = await this.cartRepository.fetchCartByUser(userId);

        if (!cart) {
            throw new CartNotFoundError();
        }

        const initialCartItemCount = cart.cartItens.length;
        cart.cartItens = cart.cartItens.filter((cartItem) => !cartItem.item.equals(item));

        //  Verificar se algum item foi removido
        if (initialCartItemCount === cart.cartItens.length) {
            throw new CartItemNotFoundError();
        }

        await cart.save();
        return { message: "Produto removido do carrinho" };
    }
}
