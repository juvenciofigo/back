import { MongooseDeliveryRepository } from "../repositories/mongoose-delivery-repository.js";
import { GetDeliveryService } from "../services/get-delivery-service.js";

export function makeGetDelivery() {
    const deliveryRepository = new MongooseDeliveryRepository();
    return new GetDeliveryService(deliveryRepository);
}
