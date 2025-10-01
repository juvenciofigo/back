import { IProduct, ProductRepository } from "../index.js";

export class GetProductService {
    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    async execute(productId: string): Promise<IProduct | null> {
        const product = await this.productRepository.findProductById(productId);

        return product;
    }
}
