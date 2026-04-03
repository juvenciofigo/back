import { MongooseSubCategoryRepository, FetchSubCategoriesService } from "../../index.js";

export function makeFetchSubCategories() {
    const mongooseSubCategoryRepository = new MongooseSubCategoryRepository();
    const fetchSubCategoriesService = new FetchSubCategoriesService(mongooseSubCategoryRepository);
    return fetchSubCategoriesService;
}
