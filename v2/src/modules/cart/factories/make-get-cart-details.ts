import { MongooseProductRepository } from "../../product/index.js";
import { MongooseCartRepository, GetCartDetailsService } from "../index.js";

export function makeGetCartDetails() {
    const mongooseCartRepository = new MongooseCartRepository();
    const mongooseProductRepository = new MongooseProductRepository();
    const getCartsService = new GetCartDetailsService(mongooseCartRepository, mongooseProductRepository);
    return getCartsService;
}
