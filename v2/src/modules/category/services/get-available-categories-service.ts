import { CategoryRepository, ICategory } from "../index.js";

export class GetAvailableCategoriesService {
    private categoryRepository: CategoryRepository;

    constructor(categoryRepository: CategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async execute(): Promise<ICategory[] | []> {
        const categories = await this.categoryRepository.getAvaliableCategories();
        return categories;
    }
}
