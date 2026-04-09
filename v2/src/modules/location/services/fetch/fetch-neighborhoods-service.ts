import { Request } from "express";
import { IRegionalRepository, INeighborhood } from "../../index.js";
import { ResponsePaginate } from "src/shared/interface.js";

export class FetchNeighborhoodsService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<ResponsePaginate<INeighborhood>> {
        const {
            cityId,
            zoneId,
            search,
            sort,
            page,
            limit,
            all,
            availability
        } = req.query as any;

        const query: any = {};
        const options: any = {};

        if (availability) {
            query.availability = availability === "true";
        }

        if (cityId) {
            query.city = cityId;
        }

        if (zoneId) {
            query.zone = zoneId;
        }

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (sort) {
            options.sort = sort;
        }

        if (all === "true") {
            options.pagination = false;
        } else {
            options.page = parseInt(page as string) || 1;
            options.limit = parseInt(limit as string) || 10;
        }

        return await this.regionalRepository.fetchNeighborhoods(query, options);
    }
}
