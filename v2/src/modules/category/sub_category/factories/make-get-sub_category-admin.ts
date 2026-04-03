import { GetSub_categoryAdminService, MongooseSub_categoryRepository } from "../../index.js";

export function makeGetSub_categoryAdmin() {
    const mongooseSub_categoryRepository = new MongooseSub_categoryRepository();
    const getSub_categoryAdminService = new GetSub_categoryAdminService(mongooseSub_categoryRepository);
    return getSub_categoryAdminService;
}
