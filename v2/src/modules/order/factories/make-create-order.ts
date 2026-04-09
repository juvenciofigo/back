import { MongooseOrderRepository } from "../repositories/mongoose-order-repository.js";
import { MongooseCartRepository } from "../../cart/repositories/mongoose-cart-repository.js";
import { MongooseUserRepository } from "../../user/repositories/mongoose-users-repository.js";
import { CreateOrderService } from "../services/create-order-service.js";

export function makeCreateOrder() {
    const orderRepository = new MongooseOrderRepository();
    const cartRepository = new MongooseCartRepository();
    const userRepository = new MongooseUserRepository();

    const service = new CreateOrderService(
        orderRepository,
        cartRepository,
        userRepository
    );

    return service;
}
