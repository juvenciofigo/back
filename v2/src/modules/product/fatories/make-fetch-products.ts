import { MongooseProductRepository, FetchProductsService } from "../index.js";

export function makeFetchProducts() {
    const mongooseProductRepository = new MongooseProductRepository();
    const fetchProductsService = new FetchProductsService(mongooseProductRepository);
    return fetchProductsService;
}
