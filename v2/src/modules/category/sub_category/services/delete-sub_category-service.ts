import { BaseError, Sub_categoryRepository } from "../../index.js";

interface Request {
    sub_categoryId: string;
}

export class DeleteSub_categoryService {
    private sub_categoryRepository: Sub_categoryRepository;

    constructor(sub_categoryRepository: Sub_categoryRepository) {
        this.sub_categoryRepository = sub_categoryRepository;
    }

    async execute({ sub_categoryId }: Request): Promise<boolean> {
        const sub_category = await this.sub_categoryRepository.getSub_category(sub_categoryId);

        if (!sub_category) {
            throw new BaseError("Sub_category Not Found!", 404);
        }

        // Opção 1: Bloquear se houver produtos
        if (sub_category.products && sub_category.products.length > 0) {
            throw new BaseError("Sub_category has associated products. Move or delete them first.", 400);
        }

        const success = await this.sub_categoryRepository.deleteSub_category(sub_categoryId);

        if (!success) {
            throw new BaseError("Failed to delete sub-category", 500);
        }

        return true;
    }
}
