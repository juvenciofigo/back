import { MongooseProductRepository, SearchProductsService } from "../index.js";

export function makeSearchProducts() {
    const mongooseProductRepository = new MongooseProductRepository();
    const searchProductsService = new SearchProductsService(mongooseProductRepository);
    return searchProductsService;
}
