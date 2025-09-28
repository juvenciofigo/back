import { BaseError, CategoryRepository, SubCategoryRepository } from "../index.js";
interface Request {
    categoryId: string;
    subCategoryName: string;
}
export class CreateSubCategoryService {
    private categoryRepository: CategoryRepository;
    private subCategoryRepository: SubCategoryRepository;

    constructor(categoryRepository: CategoryRepository, subCategoryRepository: SubCategoryRepository) {
        this.categoryRepository = categoryRepository;
        this.subCategoryRepository = subCategoryRepository;
    }

    async execute({ subCategoryName, categoryId }: Request) {
        const existingCategory = await this.categoryRepository.findCategoryById(categoryId);

        if (!existingCategory) {
            throw new BaseError("Category Not Found!", 404);
        }

        const existingSubCategory = existingCategory.subCategories.find((sub) => sub.subCategoryName.toLowerCase() === subCategoryName.toLowerCase());

        if (existingSubCategory) {
            throw new BaseError(`SubCategory ${subCategoryName} Exists On This Category !`, 409);
        }

        const subCategory = await this.subCategoryRepository.createSubCategory(subCategoryName, categoryId);

        return { message: "SubCategoria criada", subCategory };
    }
}
