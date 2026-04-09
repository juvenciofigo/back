import { BaseError, CategoryRepository, ICategory } from "../../index.js";

interface Request {
    categoryName: string;
    availability: boolean;
    categoryId: string;
}

export class UpdateCategoryService {
    private categoryRepository: CategoryRepository;

    constructor(categoryRepository: CategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async execute({ categoryName, availability, categoryId }: Request): Promise<ICategory | null> {
        const update: Partial<ICategory> = {};

        if (categoryName) {

            const existingCategoryName: ICategory | null = await this.categoryRepository.findCategoryByName(categoryName);

            if (existingCategoryName) {
                throw new BaseError("Name Already Exists", 409);
            }

            update.categoryName = categoryName;
            update.code = categoryName.toLowerCase().replace(/\s/g, "");
        }

        if (typeof availability === "boolean") {
            update.availability = availability;
        }

        const category: ICategory | null = await this.categoryRepository.updateCategory(categoryId, update);

        if (!category) {
            throw new BaseError("Category Not Found!", 404);
        }

        return category;
    }
}
