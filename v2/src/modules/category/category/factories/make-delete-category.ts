import { DeleteCategoryService, MongooseCategoryRepository } from "../../index.js";

export function makeDeleteCategory() {
    const mongooseCategoryRepository = new MongooseCategoryRepository();
    const deleteCategoryService = new DeleteCategoryService(mongooseCategoryRepository);
    return deleteCategoryService;
}
