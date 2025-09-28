import { BaseError, CategoryRepository } from "../index.js";
interface Request {
    categoryName: string;
    availability: boolean;
    products: [];
    categoryId: string;
}
export class UpdateCategoryService {
    private categoryRepository: CategoryRepository;

    constructor(categoryRepository: CategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async execute({ categoryName, availability, categoryId }: Request) {
        const existingCategoryName = await this.categoryRepository.findCategoryByName(categoryName);

        if (existingCategoryName) {
            throw new BaseError("Name Already Exists", 409);
        }

        const category = await this.categoryRepository.updateCategory({ categoryId, categoryName, availability });

        if (!category) {
            throw new BaseError("Category Not Found!", 404);
        }

        return { category };
    }
}
