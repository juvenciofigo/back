import { MongooseCategoryRepository, GetCategoryService } from "../../index.js";

export function makeGetCategory() {
    const mongooseCategoryRepository = new MongooseCategoryRepository();
    const getCategoryService = new GetCategoryService(mongooseCategoryRepository);
    return getCategoryService;
}