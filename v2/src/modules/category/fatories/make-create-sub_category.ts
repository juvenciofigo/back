import { MongooseSub_categoryRepository, MongooseSubCategoryRepository, CreateSub_CategoryService } from "../index.js";

export function makeCreateSub_category() {
    const mongooseSub_categoryRepository = new MongooseSub_categoryRepository();
    const mongooseSubCategoryRepository = new MongooseSubCategoryRepository();
    
    const createSub_categoryService = new CreateSub_CategoryService(mongooseSubCategoryRepository, mongooseSub_categoryRepository);
    return createSub_categoryService;
}
