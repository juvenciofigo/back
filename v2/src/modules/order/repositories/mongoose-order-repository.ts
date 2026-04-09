import { IOrderRepository, IOrder, OrderModel } from "../index.js";

export class MongooseOrderRepository implements IOrderRepository {
    async createOrder(data: Partial<IOrder>): Promise<IOrder | null> {
        return await OrderModel.create(data);
    }
    async updateOrder(orderId: string, update: Partial<IOrder>): Promise<IOrder | null> {
        return await OrderModel.findByIdAndUpdate(orderId, update, { new: true });
    }
    async deleteOrder(orderId: string): Promise<boolean> {
        const deleted: IOrder | null = await OrderModel.findByIdAndDelete(orderId);
        return !!deleted;
    }
    async getOrder(orderId: string): Promise<IOrder | null> {
        return await OrderModel.findById(orderId);
    }
    async getOrders(query: any, options: any): Promise<IOrder[]> {
        return await OrderModel.find(query, null, options);
    }
}
