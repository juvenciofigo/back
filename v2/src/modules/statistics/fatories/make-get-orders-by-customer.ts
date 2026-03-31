import { MongooseStatisticsRepository } from "../index.js";
import { GetOrdersByCustomerService } from "../index.js";

export function makeGetOrdersByCustomer() {
    const repository = new MongooseStatisticsRepository();
    const service = new GetOrdersByCustomerService(repository);
    return service;
}
