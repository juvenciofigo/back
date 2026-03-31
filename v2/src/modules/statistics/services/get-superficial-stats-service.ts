import { StatisticsRepository } from "../index.js";

export class GetSuperficialStatsService {
    private statisticsRepository: StatisticsRepository;

    constructor(statisticsRepository: StatisticsRepository) {
        this.statisticsRepository = statisticsRepository;
    }

    async execute() {
        // Run all queries in parallel
        const [users, orders, customers, visits] = await Promise.all([
            this.statisticsRepository.countUsers(),
            this.statisticsRepository.countOrders(),
            this.statisticsRepository.countCustomers(),
            this.statisticsRepository.countVisits()
        ]);

        return {
            visitsCount: visits,
            usersCount: users,
            ordersCount: orders,
            customersCount: customers
        };
    }
}
