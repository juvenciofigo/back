import { BaseError, SubCategoryRepository } from "../index.js";
interface Request {
    categoryId: string;
}
export class FetchSubcateriesByCategoryService {
    private subCategoryRepository: SubCategoryRepository;

    constructor(subCategoryRepository: SubCategoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
    }

    async execute({ categoryId }: Request) {
        const categories = await this.subCategoryRepository.fetchSubcategoriesByCategory(categoryId);

        if (!categories) {
            throw new BaseError("Category Not Found!", 404);
        }

        return { categories };
    }
}
