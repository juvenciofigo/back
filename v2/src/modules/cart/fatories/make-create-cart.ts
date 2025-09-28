import { MongooseCartRepository, CreateCartService } from "../index.js";

export function makeCreateCart() {
    const mongooseCartRepository = new MongooseCartRepository();
    const createCartService = new CreateCartService(mongooseCartRepository);
    return createCartService;
}
