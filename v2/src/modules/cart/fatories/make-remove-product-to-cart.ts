import { MongooseCartRepository, RemoveProductToCartService } from "../index.js";

export function makeRemoveProductToCart() {
    const mongooseCartRepository = new MongooseCartRepository();
    const removeProductToCartController = new RemoveProductToCartService(mongooseCartRepository);
    return removeProductToCartController;
}
