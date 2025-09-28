import { MongooseCartRepository, AddProductToCartService } from "../index.js";

export function makeAddProductToCart() {
    const mongooseCartRepository = new MongooseCartRepository();
    const addProductToCartController = new AddProductToCartService(mongooseCartRepository);
    return addProductToCartController;
}
