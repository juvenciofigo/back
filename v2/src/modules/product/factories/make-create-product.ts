import {
    MongooseProductRepository,
    MongooseCategoryRepository,
    MongooseSubCategoryRepository,
    AddProductToSub_CategoryService,
    CreateProductService,
    MongooseBrandRepository,
    MongooseSub_categoryRepository
} from "../index.js";

export function makeCreateProduct() {
    const mongooseProductRepository = new MongooseProductRepository();
    const mongooseCategoryRepository = new MongooseCategoryRepository();
    const mongooseSubCategoryRepository = new MongooseSubCategoryRepository();
    const mongooseSub_categoryRepository = new MongooseSub_categoryRepository();
    const mongooseBrandRepository = new MongooseBrandRepository();
    const addProductToSub_categoryService = new AddProductToSub_CategoryService(mongooseSub_categoryRepository);
    const createProductService = new CreateProductService(
        mongooseProductRepository,
        mongooseCategoryRepository,
        mongooseSubCategoryRepository,
        addProductToSub_categoryService,
        mongooseBrandRepository
    );
    return createProductService;
}
