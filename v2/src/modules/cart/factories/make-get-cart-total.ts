import { MongooseProductRepository } from "../../product/index.js";
import { MongooseCartRepository } from "../repositories/mongoose-cart-repository.js";
import { GetCartTotalService } from "../services/get-cart-total-service.js";

export function makeGetCartTotal() {
    const cartRepository = new MongooseCartRepository();
    const productRepository = new MongooseProductRepository();
    const service = new GetCartTotalService(cartRepository, productRepository);

    return service;
}
