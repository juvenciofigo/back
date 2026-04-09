import { MongooseStatisticsRepository } from "../index.js";
import { GetDataByMonthService } from "../index.js";

export function makeGetDataByMonth() {
    const repository = new MongooseStatisticsRepository();
    const service = new GetDataByMonthService(repository);
    return service;
}
