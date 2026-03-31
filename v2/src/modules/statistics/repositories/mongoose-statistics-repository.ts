import { StatisticsRepository } from "../interfaces/statistics-interface-repository.js";
import { UserModel } from "../../user/index.js";
import OrdersModel from "../../../../models/Orders.js";
import CustomersModel from "../../../../models/Customers.js";
import VisitsModel from "../../../../models/Visita.js";
import { ViewsProductsModel } from "../../product/index.js";

export class MongooseStatisticsRepository implements StatisticsRepository {
    async countUsers(): Promise<number> {
        return (await UserModel.countDocuments()) || 0;
    }

    async countOrders(): Promise<number> {
        return (await OrdersModel.countDocuments()) || 0;
    }

    async countCustomers(): Promise<number> {
        return (await CustomersModel.countDocuments()) || 0;
    }

    async countVisits(): Promise<number> {
        const visitDoc = await VisitsModel.findOne();
        return visitDoc ? visitDoc.VisitaCount : 0;
    }

    async countOrdersByCustomer(userId: string): Promise<number> {
        const customer = await CustomersModel.findOne({ user: userId });
        if (!customer) return 0;
        return (await OrdersModel.countDocuments({ customer: customer._id })) || 0;
    }

    async getUsersByMonth(): Promise<any[]> {
        return await UserModel.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);
    }

    async getOrdersByMonth(): Promise<any[]> {
        return await OrdersModel.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);
    }

    async getRecentOrders(limit: number = 10): Promise<any[]> {
        return await OrdersModel.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select("-address -orderRegistration");
            // .populate("customer")
            // .populate("payment");
    }

    async getRevenueByMonth(): Promise<any[]> {
        return await OrdersModel.aggregate([
            { $unwind: "$cart" },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalRevenue: { $sum: "$cart.subtotal" },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);
    }

    async getTopSellingProducts(limit: number = 5): Promise<any[]> {
        return await OrdersModel.aggregate([
            { $unwind: "$cart" },
            {
                $group: {
                    _id: "$cart.productId",
                    totalSold: { $sum: "$cart.quantity" },
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $project: {
                    _id: 1,
                    totalSold: 1,
                    productName: "$productDetails.productName",
                    productImages: "$productDetails.productImages"
                }
            }
        ]);
    }
}
