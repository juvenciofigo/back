import { BaseError, Sub_categoryRepository } from "../index.js";
interface Request {
    subCategoryId: string;
}
export class FetchSub_categoriesBySubCategoryService {
    private sub_categoryRepository: Sub_categoryRepository;

    constructor(sub_categoryRepository: Sub_categoryRepository) {
        this.sub_categoryRepository = sub_categoryRepository;
    }

    async execute({ subCategoryId }: Request) {
        const sub_categories = await this.sub_categoryRepository.fetchSub_categoriesBySubCategory(subCategoryId);

        if (!sub_categories) {
            throw new BaseError("Sub_category Not Found!", 404);
        }

        return { sub_categories };
    }
}
