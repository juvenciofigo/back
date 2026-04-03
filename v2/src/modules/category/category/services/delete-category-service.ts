import { BaseError, CategoryRepository } from "../../index.js";

interface Request {
    categoryId: string;
}

export class DeleteCategoryService {
    private categoryRepository: CategoryRepository;

    constructor(categoryRepository: CategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async execute({ categoryId }: Request): Promise<boolean> {
        const category = await this.categoryRepository.getCategory(categoryId);

        if (!category) {
            throw new BaseError("Category Not Found!", 404);
        }

        // Opção 1: Bloquear se houver subcategorias
        if (category.subCategories && category.subCategories.length > 0) {
            throw new BaseError("Category has associated subcategories. Delete them first.", 400);
        }

        // Opção 1: Bloquear se houver produtos
        if (category.products && category.products.length > 0) {
            throw new BaseError("Category has associated products. Move or delete them first.", 400);
        }

        const deleted = await this.categoryRepository.deleteCategory(categoryId);

        if (!deleted) {
            throw new BaseError("Failed to delete category", 500);
        }

        return true;
    }
}
