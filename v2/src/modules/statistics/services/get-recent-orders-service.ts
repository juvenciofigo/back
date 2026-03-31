import { StatisticsRepository } from "../index.js";

export class GetRecentOrdersService {
    private statisticsRepository: StatisticsRepository;

    constructor(statisticsRepository: StatisticsRepository) {
        this.statisticsRepository = statisticsRepository;
    }

    async execute() {
        const orders = await this.statisticsRepository.getRecentOrders(10);
        return { orders };
    }
}
