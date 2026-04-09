import { BaseError, ISubCategory, SubCategoryRepository } from "../../index.js";
interface Request {
    subCategoryName: string;
    availability: boolean;
    subCategoryId: string;
    categoryId: string | undefined;
}
export class UpdateSubCategoryService {
    private subCategoryRepository: SubCategoryRepository;

    constructor(subCategoryRepository: SubCategoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
    }

    async execute({ subCategoryName, availability, subCategoryId, categoryId }: Request): Promise<ISubCategory | null> {
        const update: Partial<ISubCategory> = {}

        if (subCategoryName) {
            const existingSubCategoryName: ISubCategory | null = await this.subCategoryRepository
                .findSubCategoryByName(subCategoryName);

            if (existingSubCategoryName && existingSubCategoryName.category.toString() === categoryId) {
                throw new BaseError("Subcategory Name Already Exists on this category", 409);
            }
            update.subCategoryName = subCategoryName
            update.code = subCategoryName.toLowerCase().replace(/\s/g, "");
        }

        if (typeof availability === "boolean") {
            update.availability = availability
        }

        const existingSubCategory: ISubCategory | null = await this.subCategoryRepository
            .getSubCategory(subCategoryId);

        if (!existingSubCategory) {
            throw new BaseError("Subcategory Not Found!", 404);
        }

        return await this.subCategoryRepository
            .updateSubCategory({ subCategoryName, availability, subCategoryId });
    }
}
