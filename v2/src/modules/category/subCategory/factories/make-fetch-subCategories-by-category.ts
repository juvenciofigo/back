import { MongooseSubCategoryRepository, FetchSubCategoriesByCategoryService } from "../../index.js";

export function makeFetchSubCategoriesByCategory() {
    const mongooseSubCategoryRepository = new MongooseSubCategoryRepository();
    const fetchSubCategoriesByCategoryService = new FetchSubCategoriesByCategoryService(mongooseSubCategoryRepository);
    return fetchSubCategoriesByCategoryService;
}
