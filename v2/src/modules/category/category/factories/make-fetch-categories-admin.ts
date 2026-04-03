import { MongooseCategoryRepository, FetchCategoriesAdminService } from "../../index.js";

export function makeFetchCategoriesAdmin() {
    const mongooseCategoryRepository = new MongooseCategoryRepository();
    const fetchCategoriesAdmin = new FetchCategoriesAdminService(mongooseCategoryRepository);
    return fetchCategoriesAdmin;
}
