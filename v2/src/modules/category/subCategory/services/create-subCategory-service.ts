import { BaseError, CategoryRepository, ICategory, ISubCategory, SubCategoryRepository } from "../../index.js";

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

    async execute({ subCategoryName, categoryId }: Request): Promise<ISubCategory> {

        const existingCategory: ICategory | null = await this.categoryRepository.getCategory(categoryId);

        if (!existingCategory) {
            throw new BaseError("Category Not Found!", 404);
        }

        const existingSubCategory: ISubCategory | undefined = existingCategory.subCategories.find((sub) => sub.subCategoryName.toLowerCase() === subCategoryName.toLowerCase());

        if (existingSubCategory) {
            throw new BaseError(`SubCategory "${subCategoryName}" Exists On This Category !`, 409);
        }

        const subCategory: ISubCategory = await this.subCategoryRepository.createSubCategory(subCategoryName, categoryId);

        await this.categoryRepository.addSubCategoryToCategory(categoryId, subCategory.id);

        return subCategory;
    }

}