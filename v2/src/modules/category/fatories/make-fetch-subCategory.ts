import { MongooseSubCategoryRepository, FetchSubCategoryService } from "../index.js";

export function makeFetchSubCategory() {
    const mongooseSubCategoryRepository = new MongooseSubCategoryRepository();
    const fetchSubCategoryService = new FetchSubCategoryService(mongooseSubCategoryRepository);
    return fetchSubCategoryService;
}