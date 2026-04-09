import { BaseError, ICategory, ICategoryRepository } from "../../index.js";


export class CreateCategoryService {
    private categoryRepository: ICategoryRepository;

    constructor(categoryRepository: ICategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async execute(categoryName: string): Promise<ICategory | null> {

        const existingCategory: ICategory | null = await this.categoryRepository.getCategory({ categoryName });

        if (existingCategory) {
            throw new BaseError("NameAlreadyExistsError", 409);
        }

        const category: ICategory | null = await this.categoryRepository.createCategory(categoryName);

        if (!category) {
            throw new BaseError("Failed to create category", 500);
        }

        return category;
    }
}
