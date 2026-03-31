import { StatisticsRepository } from "../index.js";

export class GetTopSellingProductsService {
    private statisticsRepository: StatisticsRepository;

    constructor(statisticsRepository: StatisticsRepository) {
        this.statisticsRepository = statisticsRepository;
    }

    async execute(limit: number = 5) {
        const products = await this.statisticsRepository.getTopSellingProducts(limit);
        return { TopSellingProducts: products };
    }
}
