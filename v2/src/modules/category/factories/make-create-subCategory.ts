import { MongooseCategoryRepository, MongooseSubCategoryRepository, CreateSubCategoryService } from "../index.js";

export function makeCreateSubCategory() {
    const mongooseCategoryRepository = new MongooseCategoryRepository();
    const mongooseSubCategoryRepository = new MongooseSubCategoryRepository();
    const createSubCategoryService = new CreateSubCategoryService(mongooseCategoryRepository, mongooseSubCategoryRepository);
    return createSubCategoryService;
}
