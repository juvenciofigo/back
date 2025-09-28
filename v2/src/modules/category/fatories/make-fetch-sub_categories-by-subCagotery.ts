import { MongooseSub_categoryRepository, FetchSub_categoriesBySubCategoryService } from "../index.js";

export function makeFetchSub_categoriesBySubCategory() {
    const mongooseSub_categoryRepository = new MongooseSub_categoryRepository();
    const fetchSub_cateriesBySubcategoryService = new FetchSub_categoriesBySubCategoryService(mongooseSub_categoryRepository);
    return fetchSub_cateriesBySubcategoryService;
}
