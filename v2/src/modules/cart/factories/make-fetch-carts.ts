import { MongooseCartRepository, FetchCartsService } from "../index.js";

export function makeFetchCarts() {
    const mongooseCartRepository = new MongooseCartRepository();
    const fetchCartsService = new FetchCartsService(mongooseCartRepository);
    return fetchCartsService;
}
