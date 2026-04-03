import { Sub_categoryRepository } from "../../index.js";
import { Request } from "express";

export class FetchSub_categoriesAdminService {
    private sub_categoryRepository: Sub_categoryRepository;

    constructor(sub_categoryRepository: Sub_categoryRepository) {
        this.sub_categoryRepository = sub_categoryRepository;
    }

    async execute(req: Request) {
        const options: any = {};

        if (req.query.subCategoryId) {
            options.subCategory = req.query.subCategoryId;
        }

        if (req.query.availability) {
            options.availability = req.query.availability;
        }

        if (req.query.sub_categoryName) {
            options.sub_categoryName = req.query.sub_categoryName;
        }

        const subCategories = await this.sub_categoryRepository.fetchSub_categories(options);

        return subCategories;
    }
}
