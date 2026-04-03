import { BaseError, SubCategoryRepository } from "../../index.js";

interface Request {
    subCategoryId: string;
}

export class DeleteSubCategoryService {
    private subCategoryRepository: SubCategoryRepository;

    constructor(subCategoryRepository: SubCategoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
    }

    async execute({ subCategoryId }: Request): Promise<boolean> {
        const subCategory = await this.subCategoryRepository.getSubCategory(subCategoryId);

        if (!subCategory) {
            throw new BaseError("SubCategory Not Found!", 404);
        }

        // Opção 1: Bloquear se houver sub-categorias (nível 3)
        if (subCategory.sub_categories && subCategory.sub_categories.length > 0) {
            throw new BaseError("SubCategory has associated sub-categories. Delete them first.", 400);
        }

        // Opção 1: Bloquear se houver produtos
        if (subCategory.products && subCategory.products.length > 0) {
            throw new BaseError("SubCategory has associated products. Move or delete them first.", 400);
        }

        const success = await this.subCategoryRepository.deleteSubCategory(subCategoryId);

        if (!success) {
            throw new BaseError("Failed to delete subcategory", 500);
        }

        return true;
    }
}
