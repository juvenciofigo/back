import { MongooseStatisticsRepository } from "../index.js";
import { GetRecentOrdersService } from "../index.js";

export function makeGetRecentOrders() {
    const repository = new MongooseStatisticsRepository();
    const service = new GetRecentOrdersService(repository);
    return service;
}
