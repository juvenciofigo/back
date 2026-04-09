import { Request } from "express-jwt";
import { ResponsePaginate } from "src/shared/interface.js";
import { IRegionalRepository, IShippingZone } from "../../index.js";

export class FetchShippingZonesService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<ResponsePaginate<IShippingZone>> {
        const {
            search,
            sort,
            page,
            limit,
            all,
            availability
        } = req.query;

        const query: any = {};
        const options: any = {};

        if (availability) {
            query.availability = availability === "true";
        }

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (sort) {
            options.sort = sort;
        }

        options.page = Number(page) || 1;
        options.limit = Number(limit) || 10;

        if (all === "true") {
            options.pagination = false;
        }

        return await this.regionalRepository.fetchShippingZones(query, options);
    }
}
