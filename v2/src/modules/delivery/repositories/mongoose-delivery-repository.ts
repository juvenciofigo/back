import { ResponsePaginate } from "src/shared/interface.js";
import { IDelivery, DeliveryModel, IDeliveryRepository } from "../index.js";

export class MongooseDeliveryRepository implements IDeliveryRepository {
    async createDelivery(data: Partial<IDelivery>, options?: any): Promise<IDelivery | null> {
        return DeliveryModel.create([data], options).then(res => res[0] || null);
    }

    async updateDelivery(deliveryId: string, update: Partial<IDelivery>, options?: any): Promise<IDelivery | null> {
        return await DeliveryModel.findByIdAndUpdate(
            deliveryId,
            { $set: update },
            {
                new: true,
                runValidators: true,
                ...options
            }
        ).exec() as IDelivery | null;
    }

    async deleteDelivery(deliveryId: string): Promise<boolean> {
        const delivery = await DeliveryModel.findByIdAndDelete(deliveryId);
        return !!delivery;

    }

    async getDelivery(query: any, options: any = {}): Promise<IDelivery | null> {
        const findQuery = DeliveryModel.findOne(query);

        if (options.select) findQuery.select(options.select);
        if (options.populate) findQuery.populate(options.populate);

        return await findQuery.exec();
    }

    async fetchDeliveries(query: any, options: any): Promise<ResponsePaginate<IDelivery>> {
        return await DeliveryModel.paginate(query, options);
    }
}