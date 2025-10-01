import { MongooseBrandRepository, FetchBrandsService } from "../index.js";

export function makeFetchBrands() {
    const mongooseBrandRepository = new MongooseBrandRepository();
    const fetchBrandsService = new FetchBrandsService(mongooseBrandRepository);
    return fetchBrandsService;
}
