import { MongooseDeliveryRepository } from "../repositories/mongoose-delivery-repository.js";
import { DeleteDeliveryService } from "../services/delete-delivery-service.js";

export function makeDeleteDelivery() {
    const deliveryRepository = new MongooseDeliveryRepository();
    return new DeleteDeliveryService(deliveryRepository);
}
