import { MongooseSubCategoryRepository, FetchSubcateriesByCategoryService } from "../index.js";

export function makeFetchSubcateriesByCategory() {
    const mongooseSubCategoryRepository = new MongooseSubCategoryRepository();
    const fetchSubcateriesByCategoryService = new FetchSubcateriesByCategoryService(mongooseSubCategoryRepository);
    return fetchSubcateriesByCategoryService;
}
