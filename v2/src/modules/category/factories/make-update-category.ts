import { MongooseCategoryRepository, UpdateCategoryService } from "../index.js";

export function makeUpdateCategory() {
    const mongooseCategoryRepository = new MongooseCategoryRepository();
    const updateCategoryService = new UpdateCategoryService(mongooseCategoryRepository);
    return updateCategoryService;
}
