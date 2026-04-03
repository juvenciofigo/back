import { CategoryRepository, ICategory } from "../../index.js";
import { Request } from "express-jwt";

export class FetchCategoriesAdminService {
    private categoryRepository: CategoryRepository;

    constructor(categoryRepository: CategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async execute(req: Request): Promise<ICategory[]> {

        const options: any = {};

        if (req.query.categoryName) {
            options.categoryName = req.query.categoryName;
        }

        if (req.query.code) {
            options.code = req.query.code;
        }

        if (req.query.available) {
            options.available = req.query.available;
        }

        return await this.categoryRepository.fetchCategories(options);
    }
}
