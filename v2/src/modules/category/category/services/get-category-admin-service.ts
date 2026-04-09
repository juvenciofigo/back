import { BaseError, ICategoryRepository, ICategory } from "../../index.js";

export class GetCategoryAdminService {
    private categoryRepository: ICategoryRepository;

    constructor(categoryRepository: ICategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async execute(categoryId: string): Promise<ICategory> {
        const category: ICategory | null = await this.categoryRepository.getCategory({ _id: categoryId });

        if (!category) {
            throw new BaseError("Category Not Found!", 404);
        }


        return category;
    }
}
