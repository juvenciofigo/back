import { MongooseSub_categoryRepository, UpdateSub_categoryService } from "../index.js";

export function makeUpdateSub_category() {
    const mongooseSub_categoryRepository = new MongooseSub_categoryRepository();
    const updateSub_categoryService = new UpdateSub_categoryService(mongooseSub_categoryRepository);
    return updateSub_categoryService;
}
