import { MongooseCategoryRepository, FetchCategoryService } from "../index.js";

export function makeFetchCategory() {
    const mongooseCategoryRepository = new MongooseCategoryRepository();
    const fetchCategoryService = new FetchCategoryService(mongooseCategoryRepository);
    return fetchCategoryService;
}