import { MongooseCategoryRepository, FetchCategoriesService } from "../../index.js";

export function makeFetchCategories() {
    const mongooseCategoryRepository = new MongooseCategoryRepository();
    const fetchCategories = new FetchCategoriesService(mongooseCategoryRepository);
    return fetchCategories;
}
