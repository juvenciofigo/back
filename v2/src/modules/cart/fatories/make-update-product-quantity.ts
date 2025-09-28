import { MongooseCartRepository, UpdateProductQuantitytService } from "../index.js";

export function makeUpdateProductQuantity() {
    const mongooseCartRepository = new MongooseCartRepository();
    const removeProductToCartController = new UpdateProductQuantitytService(mongooseCartRepository);
    return removeProductToCartController;
}
