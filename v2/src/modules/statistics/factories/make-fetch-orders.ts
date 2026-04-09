import { MongooseStatisticsRepository } from "../repositories/mongoose-statistics-repository.js";
import { FetchOrdersService } from "../services/fetch-orders-service.js";

export function makeFetchOrders() {
    const mongooseStatisticsRepository = new MongooseStatisticsRepository();
    const fetchOrdersService = new FetchOrdersService(mongooseStatisticsRepository);
    return fetchOrdersService;
}
