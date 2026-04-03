import { MongooseProductRepository, GetProductService } from "../index.js";

export function makeGetProduct() {
    const mongooseProductRepository = new MongooseProductRepository();
    const getProductService = new GetProductService(mongooseProductRepository);
    return getProductService;
}
