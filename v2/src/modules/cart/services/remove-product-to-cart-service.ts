import { CartItemNotFoundError, CartNotFoundError, CartRepository, ICart } from "../index.js";
import calculateTotal from "../utils/calculateTotal.js";

interface Request {
    userId: string;
    itemId: string;
}

export class RemoveProductToCartService {
    private cartRepository: CartRepository;

    constructor(cartRepository: CartRepository) {
        this.cartRepository = cartRepository;
    }

    async execute({ userId, itemId }: Request) {
        const cart: ICart | null = await this.cartRepository.getCart({ cartUser: userId });

        if (!cart) {
            throw new CartNotFoundError();
        }

        const initialCartItemCount = cart.cartItens.length;
        cart.cartItens = cart.cartItens.filter((cartItem) => cartItem.item?.toString() !== itemId) as any;

        cart.markModified("cartItens");

        //  Verificar se algum item foi removido
        if (initialCartItemCount === cart.cartItens.length) {
            throw new CartItemNotFoundError();
        }

        const newCart = await cart.save();

        const total = calculateTotal(newCart.cartItens);

        return { total, items: newCart.cartItens };
    }
}
