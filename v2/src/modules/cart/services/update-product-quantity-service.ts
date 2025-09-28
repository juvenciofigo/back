import { log } from "node:console";
import { CartItemNotFoundError, CartNotFoundError, CartRepository, ICart } from "../index.js";

interface Request {
    userId: string;
    itemId: string;
    quantity: number;
}

export class UpdateProductQuantitytService {
    private cartRepository: CartRepository;

    constructor(cartRepository: CartRepository) {
        this.cartRepository = cartRepository;
    }

    async execute({ userId, itemId, quantity }: Request) {
        if (!quantity || quantity <= 0) {
            throw new Error("Quantidade inválida");
        }

        const cart: ICart | null = await this.cartRepository.fetchCartByUser(userId);

        if (!cart) {
            throw new CartNotFoundError();
        }

        const itemToRemove = cart.cartItens.find((i) => i.item.toString() === itemId);
        
        if (!itemToRemove) {
            throw new CartItemNotFoundError();
        }

        itemToRemove.quantity = quantity;
        await cart.save();
        return { message: "Quantidade atualizada", cart };
    }
}
