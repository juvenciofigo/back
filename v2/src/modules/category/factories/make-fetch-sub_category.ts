import { MongooseSub_categoryRepository, FetchSub_categoryService } from "../index.js";

export function makeFetchSub_category() {
    const mongooseSub_categoryRepository = new MongooseSub_categoryRepository();
    const fetchSub_categoryService = new FetchSub_categoryService(mongooseSub_categoryRepository);
    return fetchSub_categoryService;
}