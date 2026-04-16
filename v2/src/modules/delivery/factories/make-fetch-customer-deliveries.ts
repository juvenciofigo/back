import { MongooseDeliveryRepository } from "../repositories/mongoose-delivery-repository.js";
import { FetchCustomerDeliveriesService } from "../services/fetch-customer-deliveries-service.js";

export function makeFetchCustomerDeliveries() {
    const deliveryRepository = new MongooseDeliveryRepository();
    return new FetchCustomerDeliveriesService(deliveryRepository);
}
