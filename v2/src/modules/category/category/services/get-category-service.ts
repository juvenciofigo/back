import { BaseError, ICategoryRepository, ICategory } from "../../index.js";


export class GetCategoryService {
    private categoryRepository: ICategoryRepository;

    constructor(categoryRepository: ICategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async execute(categoryId: string): Promise<ICategory> {
        const category: ICategory | null = await this.categoryRepository.getCategory({ _id: categoryId, availability: true });

        if (!category) {
            throw new BaseError("Category Not Found!", 404);
        }


        return category;
    }
}
