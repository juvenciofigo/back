import { MongooseCartRepository, UpdateProductQuantityService } from "../index.js";

export function makeUpdateProductQuantity() {
    const mongooseCartRepository = new MongooseCartRepository();
    return new UpdateProductQuantityService(mongooseCartRepository);
}
