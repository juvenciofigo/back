import { MongooseDeliveryRepository } from "../repositories/mongoose-delivery-repository.js";
import { CreateDeliveryService } from "../services/create-delivery-service.js";
import { MongooseOrderRepository } from "../../order/index.js";
import { MongooseAddressRepository } from "../../addresses/index.js";
import { RegionalRepository } from "../../location/index.js";
import { MongooseProductRepository } from "../../product/index.js";

export function makeCreateDelivery() {
    const deliveryRepository = new MongooseDeliveryRepository();
    const orderRepository = new MongooseOrderRepository();
    const addressRepository = new MongooseAddressRepository();
    const regionalRepository = new RegionalRepository();
    const productRepository = new MongooseProductRepository();

    return new CreateDeliveryService(
        deliveryRepository,
        orderRepository,
        addressRepository,
        regionalRepository,
        productRepository
    );
}
