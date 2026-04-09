import { BaseError, ISubCategoryRepository, ISubCategory } from "../../index.js";

export class GetSubCategoryAdminService {
    private subCategoryRepository: ISubCategoryRepository;

    constructor(subCategoryRepository: ISubCategoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
    }

    async execute(subCategoryId: string): Promise<ISubCategory> {
        const subCategory = await this.subCategoryRepository.getSubCategory({ _id: subCategoryId });

        if (!subCategory) {
            throw new BaseError("SubCategory Not Found!", 404);
        }

        return subCategory;
    }
}
