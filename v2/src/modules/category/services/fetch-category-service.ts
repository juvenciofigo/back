import { BaseError, CategoryRepository, ICategory } from "../index.js";
interface Request {
    categoryId: string;
}

export class FetchCategoryService {
    private categoryRepository: CategoryRepository;

    constructor(categoryRepository: CategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async execute({ categoryId }: Request) {
        const category = await this.categoryRepository.findCategoryById(categoryId);

        if (!category) {
            throw new BaseError("Category Not Found!", 404);
        }

        return {category};
    }
}
