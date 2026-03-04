import { MongooseCartRepository } from "../repositories/mongoose-cart-repository.js";
import { GetCartTotalService } from "../services/get-cart-total-service.js";

export function makeGetCartTotal() {
    const cartRepository = new MongooseCartRepository();
    const service = new GetCartTotalService(cartRepository as any);

    return service;
}
