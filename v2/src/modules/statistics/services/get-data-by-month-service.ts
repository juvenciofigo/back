import { StatisticsRepository } from "../index.js";

export class GetDataByMonthService {
    private statisticsRepository: StatisticsRepository;

    constructor(statisticsRepository: StatisticsRepository) {
        this.statisticsRepository = statisticsRepository;
    }

    async execute() {
        const [ordersByMonth, usersByMonth] = await Promise.all([
            this.statisticsRepository.getOrdersByMonth(),
            this.statisticsRepository.getUsersByMonth()
        ]);

        return {
            OrdersByMonth: ordersByMonth,
            UsersByMonth: usersByMonth
        };
    }
}
