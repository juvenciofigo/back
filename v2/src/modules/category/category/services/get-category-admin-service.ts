import { BaseError, CategoryRepository, ICategory } from "../../index.js";

export class GetCategoryAdminService {
    private categoryRepository: CategoryRepository;

    constructor(categoryRepository: CategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async execute(categoryId: string): Promise<ICategory> {
        const category = await this.categoryRepository.getCategory(categoryId);

        if (!category) {
            throw new BaseError("Category Not Found!", 404);
        }


        return category;
    }
}
