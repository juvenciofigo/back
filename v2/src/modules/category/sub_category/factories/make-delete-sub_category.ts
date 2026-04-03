import { DeleteSub_categoryService, MongooseSub_categoryRepository } from "../../index.js";

export function makeDeleteSub_category() {
    const mongooseSub_categoryRepository = new MongooseSub_categoryRepository();
    const deleteSub_categoryService = new DeleteSub_categoryService(mongooseSub_categoryRepository);
    return deleteSub_categoryService;
}
