import { MongooseCartRepository, GetCartDetailsService } from "../index.js";

export function makeGetCartDetails() {
    const mongooseCartRepository = new MongooseCartRepository();
    const getCartsService = new GetCartDetailsService(mongooseCartRepository);
    return getCartsService;
}
