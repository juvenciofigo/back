import { MongooseStatisticsRepository } from "../index.js";
import { GetRevenueByMonthService } from "../index.js";

export function makeGetRevenueByMonth() {
    const repository = new MongooseStatisticsRepository();
    const service = new GetRevenueByMonthService(repository);
    return service;
}
