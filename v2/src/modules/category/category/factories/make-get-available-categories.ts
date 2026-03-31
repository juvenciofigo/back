import { MongooseCategoryRepository, GetAvailableCategoriesService } from "../index.js";

export function makeGetAvailableCategories() {
    const mongooseCategoryRepository = new MongooseCategoryRepository();
    const getAvailableCategories = new GetAvailableCategoriesService(mongooseCategoryRepository);
    return getAvailableCategories;
}
