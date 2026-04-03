import { MongooseSubCategoryRepository, FetchSubCategoriesAdminService } from "../../index.js";

export function makeFetchSubCategoriesAdmin() {
    const mongooseSubCategoryRepository = new MongooseSubCategoryRepository();
    const fetchSubCategoriesAdminService = new FetchSubCategoriesAdminService(mongooseSubCategoryRepository);
    return fetchSubCategoriesAdminService;
}
