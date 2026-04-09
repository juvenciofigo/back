import { ResponsePaginate } from "src/shared/interface.js";
import { IAddressRepository, IAddress } from "../index.js";
import { Request } from "express-jwt";

export class FetchAddressesAdminService {
    constructor(private addressRepository: IAddressRepository) { }

    async execute(req: Request): Promise<ResponsePaginate<IAddress>> {
        const { search, sort, page, limit, all, customerId, deleted } = req.query as Record<string, string>;

        const query: any = {};

        if (search) {
            query.$or = [
                { complete: { $regex: search, $options: "i" } },
            ];
        }

        if (customerId) query.customer = customerId;

        if (deleted) query.deleted = deleted === "true";

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
            populate: [
                { path: "city" },
                { path: "province" },
                { path: "neighborhood" },
            ],
        };

        return await this.addressRepository.fetchAddresses(query, options);
    }
}
