import { CartRepository, ICart } from "../index.js";

interface Response {
    carts: ICart[];
    count: number;
}
export class GetCartsService {
    private cartRepository: CartRepository;

    constructor(cartRepository: CartRepository) {
        this.cartRepository = cartRepository;
    }

    async execute(): Promise<Response> {
        const carts = await this.cartRepository.getCarts();

        return { count: carts.length, carts };
    }
}
