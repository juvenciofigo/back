import { MongooseSub_categoryRepository, FetchSub_categoriesService } from "../../index.js";

export function makeFetchSub_categories() {
    const mongooseSub_categoryRepository = new MongooseSub_categoryRepository();
    const fetchSub_categoriesService = new FetchSub_categoriesService(mongooseSub_categoryRepository);
    return fetchSub_categoriesService;
}
