import { MongooseDeliveryRepository } from "../repositories/mongoose-delivery-repository.js";
import { UpdateDeliveryService } from "../services/update-delivery-service.js";

export function makeUpdateDelivery() {
    const deliveryRepository = new MongooseDeliveryRepository();
    return new UpdateDeliveryService(deliveryRepository);
}
