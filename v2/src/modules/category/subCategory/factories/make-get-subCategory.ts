import { MongooseSubCategoryRepository, GetSubCategoryService } from "../../index.js";

export function makeGetSubCategory() {
    const mongooseSubCategoryRepository = new MongooseSubCategoryRepository();
    const getSubCategoryService = new GetSubCategoryService(mongooseSubCategoryRepository);
    return getSubCategoryService;
}
