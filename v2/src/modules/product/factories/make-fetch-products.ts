import {
    MongooseProductRepository,
    FetchProductsService,
    MongooseCategoryRepository,
    GetCategoryService,
    MongooseSubCategoryRepository,
    GetSubCategoryService,
    MongooseSub_categoryRepository,
    GetSub_categoryService
} from "../index.js";

export function makeFetchProducts() {
    const mongooseProductRepository = new MongooseProductRepository();
    const mongooseCategoryRepository = new MongooseCategoryRepository();
    const mongooseSubCategoryRepository = new MongooseSubCategoryRepository();
    const mongooseSub_categoryRepository = new MongooseSub_categoryRepository();

    const getCategoryService = new GetCategoryService(mongooseCategoryRepository);
    const getSubCategoryService = new GetSubCategoryService(mongooseSubCategoryRepository);
    const getSub_categoryService = new GetSub_categoryService(mongooseSub_categoryRepository);

    const fetchProductsService = new FetchProductsService(
        mongooseProductRepository,
        getCategoryService,
        getSubCategoryService,
        getSub_categoryService
    );
    return fetchProductsService;
}
