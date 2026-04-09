import { Request } from "express";
import { ResponsePaginate } from "src/shared/interface.js";
import { IBrand, IBrandRepository } from "../index.js";

export class FetchBrandsService {
    constructor(private brandRepository: IBrandRepository) { }

    async execute(req: Request): Promise<ResponsePaginate<IBrand>> {
        const {
            search,
            sort,
            page,
            limit,
            all
        } = req.query;

        const query: any = {};

        // 1. Busca por Nome (Regex parcial e case-insensitive)
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        // 2. Organização das Opções de Paginação e Ordenação
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

        const options: any = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: sortOptions,
            pagination: all !== "true",
        };

        return await this.brandRepository.fetchBrands(query, options);
    }
}
