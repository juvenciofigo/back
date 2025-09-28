import { MongooseProductRepository, CreateProductService } from "../index.js";

export function makeCreateProduct() {
    const mongooseProductRepository = new MongooseProductRepository();
    const createProductService = new CreateProductService(mongooseProductRepository);
    return createProductService;
}
