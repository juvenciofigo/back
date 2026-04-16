import { MongooseDeliveryRepository } from "../repositories/mongoose-delivery-repository.js";
import { FetchDeliveriesService } from "../services/fetch-deliveries-service.js";

export function makeFetchDeliveries() {
    const deliveryRepository = new MongooseDeliveryRepository();
    return new FetchDeliveriesService(deliveryRepository);
}
