import { CreateBrandService, MongooseBrandRepository } from "../index.js";

export function makeCreateBrand() {
    const mongooseBrandRepository = new MongooseBrandRepository();
    const createBrandService = new CreateBrandService(mongooseBrandRepository);
    return createBrandService;
}
