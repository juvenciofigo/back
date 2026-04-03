import { GetSubCategoryAdminService, MongooseSubCategoryRepository } from "../../index.js";

export function makeGetSubCategoryAdmin() {
    const mongooseSubCategoryRepository = new MongooseSubCategoryRepository();
    const getSubCategoryAdminService = new GetSubCategoryAdminService(mongooseSubCategoryRepository);
    return getSubCategoryAdminService;
}
