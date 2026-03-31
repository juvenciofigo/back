import { MongooseStatisticsRepository } from "../index.js";
import { GetTopSellingProductsService } from "../index.js";

export function makeGetTopSellingProducts() {
    const repository = new MongooseStatisticsRepository();
    const service = new GetTopSellingProductsService(repository);
    return service;
}
