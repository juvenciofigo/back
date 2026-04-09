import { CartRepository, ICart } from "../index.js";



export class CreateCartService {
    private cartRepository: CartRepository;

    constructor(cartRepository: CartRepository) {
        this.cartRepository = cartRepository;
    }

    async execute(userId: string): Promise<ICart> {

        const cart: ICart | null = await this.cartRepository.getCartByUserId(userId);

        if (cart) {
            return cart;
        }

        return await this.cartRepository.create(userId);

    }
}
