import { ISubCategory, SubCategoryRepository } from "../../index.js";
import { Request } from "express-jwt";

export class FetchSubCategoriesAdminService {
    private subCategoryRepository: SubCategoryRepository;

    constructor(subCategoryRepository: SubCategoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
    }

    async execute(req: Request): Promise<ISubCategory[] | []> {
        const options: any = {}

        if (req.query.availability) {
            options.availability = req.query.availability;
        }

        if (req.query.subCategoryName) {
            options.subCategoryName = req.query.subCategoryName;
        }

        if (req.query.categoryId) {
            options.category = req.query.categoryId
        }

        const subCategories = await this.subCategoryRepository
            .fetchSubcategories(options);

        return subCategories;
    }
}
