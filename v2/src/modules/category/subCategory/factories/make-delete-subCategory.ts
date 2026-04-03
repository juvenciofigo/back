import { DeleteSubCategoryService, MongooseSubCategoryRepository } from "../../index.js";

export function makeDeleteSubCategory() {
    const mongooseSubCategoryRepository = new MongooseSubCategoryRepository();
    const deleteSubCategoryService = new DeleteSubCategoryService(mongooseSubCategoryRepository);
    return deleteSubCategoryService;
}
