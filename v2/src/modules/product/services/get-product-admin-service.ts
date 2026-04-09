import { IProductRepository, ProductNotFoundError, IProduct } from "../index.js";

export class GetProductService {
    constructor(private productRepository: IProductRepository) { }

    async execute(productId: string): Promise<IProduct | null> {
        const product = await this.productRepository.getProduct({ id: productId });

        if (!product) {
            throw new ProductNotFoundError();
        }

        return product;
    }
}
