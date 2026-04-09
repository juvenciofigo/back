import { MongooseCartRepository, AddProductToCartService, MongooseProductRepository } from "../index.js";

export function makeAddProductToCart() {
    const mongooseCartRepository = new MongooseCartRepository();
    const mongooseProductRepository = new MongooseProductRepository();
    const addProductToCartController = new AddProductToCartService(mongooseCartRepository, mongooseProductRepository);
    return addProductToCartController;
}
