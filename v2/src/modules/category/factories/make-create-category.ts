import { MongooseCategoryRepository, CreateCategoryService } from "../index.js";

export function makeCreateCategory() {
    const mongooseCategoryRepository = new MongooseCategoryRepository();
    const createCategoryService = new CreateCategoryService(mongooseCategoryRepository);
    return createCategoryService;
}
