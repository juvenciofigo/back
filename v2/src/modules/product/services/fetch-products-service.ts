import { IProduct, ProductRepository } from "../index.js";

export class FetchProductsService {
    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    async execute(): Promise<IProduct[] | []> {
        const products = await this.productRepository.fetchProducts();

        return products;
    }
}
