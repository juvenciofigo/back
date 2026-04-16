import { IOrder } from "../index.js";

export interface IOrderRepository {
    createOrder(order: Partial<IOrder>, options?: any): Promise<IOrder | null>;
    updateOrder(orderId: string, update: Partial<IOrder>, options?: any): Promise<IOrder | null>;
    deleteOrder(orderId: string): Promise<boolean>;
    getOrder(query: any): Promise<IOrder | null>;
    getOrders(query: any, options: any): Promise<IOrder[]>;
}