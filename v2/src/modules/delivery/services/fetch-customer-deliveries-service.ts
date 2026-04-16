import { IDeliveryRepository, ResponsePaginate, IDelivery } from "../index.js";

export class FetchCustomerDeliveriesService {
    constructor(private deliveryRepository: IDeliveryRepository) { }

    async execute(customerId: string, data: any): Promise<ResponsePaginate<IDelivery>> {
        const query: any = { customer: customerId };
        const options: any = {
            page: Number(data.page) || 1,
            limit: Number(data.limit) || 20,
            sort: { createdAt: -1 },
            populate: [
                { path: "shippingAddress.province", select: "name" },
                { path: "shippingAddress.city", select: "name" },
                { path: "order", select: "referenceOrder status" }
            ]
        };

        if (data.status) {
            query.status = data.status;
        }

        return await this.deliveryRepository.fetchDeliveries(query, options);
    }
}
