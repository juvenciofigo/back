import { BaseError, SubCategoryRepository, ISubCategory } from "../../index.js";

export class GetSubCategoryAdminService {
    private subCategoryRepository: SubCategoryRepository;

    constructor(subCategoryRepository: SubCategoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
    }

    async execute(subCategoryId: string): Promise<ISubCategory> {
        const subCategory = await this.subCategoryRepository.getSubCategory(subCategoryId);

        if (!subCategory) {
            throw new BaseError("SubCategory Not Found!", 404);
        }

        return subCategory;
    }
}
