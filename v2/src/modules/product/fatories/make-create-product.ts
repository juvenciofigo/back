import { MongooseProductRepository, MongooseCategoryRepository, MongooseSubCategoryRepository, MongooseSub_categoryRepository, CreateProductService, MongooseBrandRepository } from "../index.js";

export function makeCreateProduct() {
    const mongooseProductRepository = new MongooseProductRepository();
    const mongooseCategoryRepository = new MongooseCategoryRepository();
    const mongooseSubCategoryRepository = new MongooseSubCategoryRepository();
    const mongooseSub_categoryRepository = new MongooseSub_categoryRepository();
    const mongooseBrandRepository = new MongooseBrandRepository();
    const createProductService = new CreateProductService(
        mongooseProductRepository,
        mongooseCategoryRepository,
        mongooseSubCategoryRepository,
        mongooseSub_categoryRepository,
        mongooseBrandRepository
    );
    return createProductService;
}
