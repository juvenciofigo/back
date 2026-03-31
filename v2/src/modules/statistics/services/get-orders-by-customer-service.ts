import { StatisticsRepository } from "../index.js";

export class GetOrdersByCustomerService {
    private statisticsRepository: StatisticsRepository;

    constructor(statisticsRepository: StatisticsRepository) {
        this.statisticsRepository = statisticsRepository;
    }

    async execute(userId: string) {
        const count = await this.statisticsRepository.countOrdersByCustomer(userId);
        return { count };
    }
}
