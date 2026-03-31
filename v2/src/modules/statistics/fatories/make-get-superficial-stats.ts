import { MongooseStatisticsRepository } from "../index.js";
import { GetSuperficialStatsService } from "../index.js";

export function makeGetSuperficialStats() {
    const repository = new MongooseStatisticsRepository();
    const service = new GetSuperficialStatsService(repository);
    return service;
}
