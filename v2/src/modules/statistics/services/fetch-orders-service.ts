import { Request } from "express";
import { ResponsePaginate } from "src/shared/interface.js";
import { IOrder } from "../../order/index.js";
import { StatisticsRepository } from "../repositories/statistics-interface-repository.js";

export class FetchOrdersService {
    constructor(private statisticsRepository: StatisticsRepository) { }

    async execute(req: Request): Promise<ResponsePaginate<IOrder>> {
        const {
            status,
            userId,
            startDate,
            endDate,
            sort,
            page,
            limit
        } = req.query;

        const query: any = { deleted: false };

        // 1. Filtro por Estado do Pedido
        if (status) {
            query.status = status;
        }

        // 2. Filtro por Cliente (UserId)
        if (userId) {
            query.customer = userId;
        }

        // 3. Filtro por Intervalo de Datas
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate as string);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate as string);
            }
        }

        // 4. Organização das Opções de Paginação e Ordenação
        const sortOptions: any = {};
        switch (sort) {
            case "oldest":
                sortOptions.createdAt = 1;
                break;
            case "newest":
            default:
                sortOptions.createdAt = -1;
                break;
        }

        const options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: sortOptions,
            select: "-address -orderRegistration",
            populate: [
                { path: "customer", select: "firstName lastName email" },
                { path: "payment", select: "paymentMethod status" }
            ]
        };

        return await this.statisticsRepository.fetchOrders(query, options);
    }
}
