import { IDeliveryRepository, ResponsePaginate, IDelivery } from "../index.js";

export class FetchDeliveriesService {
    constructor(private deliveryRepository: IDeliveryRepository) { }

    async execute(data: any): Promise<ResponsePaginate<IDelivery>> {

        const query: any = {};
        const options: any = {
            page: Number(data.page) || 1,
            limit: Number(data.limit) || 20,
        };

        if (data.search) {
            query.$or = [
                { trackingCode: { $regex: data.search, $options: "i" } },
                { status: { $regex: data.search, $options: "i" } },
            ];
        }

        if (data.sort) {
            switch (data.sort) {
                case "oldest":
                    options.sort = { createdAt: 1 };
                    break;
                case "newest":
                default:
                    options.sort = { createdAt: -1 };
                    break;
            }
        }

        if (data.status) {
            query.status = data.status;
        }

        if (data.deliveryType) {
            query.deliveryType = data.deliveryType;
        }

        if (data.trackingCode) {
            query.trackingCode = data.trackingCode;
        }

        if (data.deliveryDeadline) {
            query.deliveryDeadline = data.deliveryDeadline;
        }

        return await this.deliveryRepository.fetchDeliveries(query, options);
    }
}