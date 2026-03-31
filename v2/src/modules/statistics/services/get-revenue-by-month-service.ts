import { StatisticsRepository } from "../index.js";

export class GetRevenueByMonthService {
    private statisticsRepository: StatisticsRepository;

    constructor(statisticsRepository: StatisticsRepository) {
        this.statisticsRepository = statisticsRepository;
    }

    async execute() {
        const revenueByMonth = await this.statisticsRepository.getRevenueByMonth();
        return { RevenueByMonth: revenueByMonth };
    }
}
