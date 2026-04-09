import { ResponsePaginate } from "src/shared/interface.js";
import { IOrder } from "../../order/index.js";

export interface StatisticsRepository {
    countUsers(): Promise<number>;
    countOrders(): Promise<number>;
    // countCustomers(): Promise<number>;
    // countVisits(): Promise<number>;
    // countOrdersByCustomer(userId: string): Promise<number>;
    getUsersByMonth(): Promise<any[]>;
    getOrdersByMonth(): Promise<any[]>;
    getRecentOrders(limit?: number): Promise<any[]>;
    getRevenueByMonth(): Promise<any[]>;
    getTopSellingProducts(limit?: number): Promise<any[]>;
    fetchOrders(query: any, options: any): Promise<ResponsePaginate<IOrder>>;
}
