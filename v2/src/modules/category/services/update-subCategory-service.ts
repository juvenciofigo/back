import { BaseError, SubCategoryRepository } from "../index.js";
interface Request {
    subCategoryName: string;
    availability: boolean;
    products: [];
    subCategoryId: string;
    categoryId: string | undefined;
}
export class UpdateSubCategoryService {
    private subCategoryRepository: SubCategoryRepository;

    constructor(subCategoryRepository: SubCategoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
    }

    async execute({ subCategoryName, availability, subCategoryId, categoryId }: Request) {
        const existingSubCategoryName = await this.subCategoryRepository.findSubCategoryByName(subCategoryName);

        if (existingSubCategoryName && existingSubCategoryName.category.toString() === categoryId) {
            throw new BaseError("Subcategory Name Already Exists on this category", 409);
        }

        const existingSubCategory = await this.subCategoryRepository.findSubCategoryById(subCategoryId);

        if (!existingSubCategory) {
            throw new BaseError("Subcategory Not Found!", 404);
        }

        const subCategory = await this.subCategoryRepository.updateSubCategory({ subCategoryName, availability, subCategoryId });

        return { subCategory };
    }
}
