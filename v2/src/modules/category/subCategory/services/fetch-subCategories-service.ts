import { SubCategoryRepository } from "../../index.js";
import { Request } from "express-jwt";

export class FetchSubCategoriesService {
    private subCategoryRepository: SubCategoryRepository;

    constructor(subCategoryRepository: SubCategoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
    }

    async execute(req: Request) {

        const options: any = {
            availability: true
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
