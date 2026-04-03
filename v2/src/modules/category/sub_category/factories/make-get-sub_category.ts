import { MongooseSub_categoryRepository, GetSub_categoryService } from "../../index.js";

export function makeGetSub_category() {
    const mongooseSub_categoryRepository = new MongooseSub_categoryRepository();
    const getSub_categoryService = new GetSub_categoryService(mongooseSub_categoryRepository);
    return getSub_categoryService;
}
