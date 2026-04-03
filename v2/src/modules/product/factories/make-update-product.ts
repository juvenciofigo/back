import { MongooseProductRepository, MongooseCategoryRepository, MongooseSubCategoryRepository, MongooseSub_categoryRepository, UpdateProductService, MongooseBrandRepository } from "../index.js";

export function makeUpdateProduct() {
    const mongooseProductRepository = new MongooseProductRepository();
    const mongooseCategoryRepository = new MongooseCategoryRepository();
    const mongooseSubCategoryRepository = new MongooseSubCategoryRepository();
    const mongooseSub_categoryRepository = new MongooseSub_categoryRepository();
    const mongooseBrandRepository = new MongooseBrandRepository();
    const updateProductService = new UpdateProductService(
        mongooseProductRepository,
        mongooseCategoryRepository,
        mongooseSubCategoryRepository,
        mongooseSub_categoryRepository,
        mongooseBrandRepository
    );
    return updateProductService;
}
