import { BaseError, CategoryRepository } from "../index.js";
interface Request {
    categoryName: string;
}
export class CreateCategoryService {
    private categoryRepository: CategoryRepository;

    constructor(categoryRepository: CategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async execute({ categoryName }: Request) {
        
        const existingCategory = await this.categoryRepository.findCategoryByName(categoryName);

        if (existingCategory) {
            throw new BaseError("NameAlreadyExistsError", 409);
        }

        const category = await this.categoryRepository.createCategory(categoryName);

        return { category };
    }
}
