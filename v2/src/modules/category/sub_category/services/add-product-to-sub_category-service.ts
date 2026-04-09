import { ISub_categoryRepository } from "../../index.js";

interface Request {
    sub_categoryId: string;
    productId: string | string[];
}

export class AddProductToSub_CategoryService {
    private sub_categoryRepository: ISub_categoryRepository;

    constructor(sub_categoryRepository: ISub_categoryRepository) {
        this.sub_categoryRepository = sub_categoryRepository;
    }

    async execute({ sub_categoryId, productId }: Request) {
        const products = Array.isArray(productId) ? productId : [productId];

        return this.sub_categoryRepository.addProductToSub_category(sub_categoryId, products);
    }
}