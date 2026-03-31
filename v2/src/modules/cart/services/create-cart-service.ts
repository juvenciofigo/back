import { CartRepository, ICart } from "../index.js";

interface Request {
    userId: string;
}

export class CreateCartService {
    private cartRepository: CartRepository;

    constructor(cartRepository: CartRepository) {
        this.cartRepository = cartRepository;
    }

    async execute({ userId }: Request): Promise<ICart> {
        const cart = await this.cartRepository.create(userId);

        return cart;
    }
}
