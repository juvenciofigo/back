import { MongooseCartRepository, GetCartsService } from "../index.js";

export function makeGetCarts() {
    const mongooseCartRepository = new MongooseCartRepository();
    const getCartsService = new GetCartsService(mongooseCartRepository);
    return getCartsService;
}
