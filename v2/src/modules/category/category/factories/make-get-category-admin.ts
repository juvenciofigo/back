import { MongooseCategoryRepository, GetCategoryAdminService } from "../../index.js";

export function makeGetCategoryAdmin() {
    const mongooseCategoryRepository = new MongooseCategoryRepository();
    const getCategoryService = new GetCategoryAdminService(mongooseCategoryRepository);
    return getCategoryService;
}