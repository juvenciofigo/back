import { MongooseSubCategoryRepository, UpdateSubCategoryService } from "../index.js";

export function makeUpdateSubCategory() {
    const mongooseSubCategoryRepository = new MongooseSubCategoryRepository();
    const updateSubCategoryService = new UpdateSubCategoryService(mongooseSubCategoryRepository);
    return updateSubCategoryService;
}
