const Addresses = require("../models/Addresses"),
    Carts = require("../models/Carts"),
    Categories = require("../models/Categories"),
    Customers = require("../models/Customers"),
    Visits = require("../models/Visits"),
    Deliveries = require("../models/Deliveries"),
    Notifications = require("../models/Notifications"),
    OrderRegistrations = require("../models/OrderRegistrations"),
    Orders = require("../models/Orders"),
    Payments = require("../models/Payments"),
    Products = require("../models/Products"),
    Ratings = require("../models/Ratings"),
    Stores = require("../models/Stores"),
    Users = require("../models/Users"),
    Variations = require("../models/Variations");

class EstatisticController {
    async superficial(req, res, next) {
        try {
            let users = await Users.countDocuments();
            if (!users) {
                users = 0;
            }
            let orders = await Orders.countDocuments();
            if (!orders) {
                orders = 0;
            }
            let customers = await Customers.countDocuments();
            if (!customers) {
                customers = 0;
            }

            let visitDoc = await Visits.findOne()
            console.log(visitDoc);
            if (!visitDoc) {
                visitDoc = 0;
            }

            return res.status(200).json({ visitsCount: visitDoc, usersCount: users, ordersCount: orders, customersCount: customers });
        } catch (error) {
            next(error);
        }
    }
    async ordersByCustumer(req, res, next) {
        const user = req.params.user;

        try {
            const customer = await Customers.findOne({ user: user });
            if (!customer) {
                return res.status(404).json({ count: 0 });
            }
            const orders = await Orders.countDocuments({ customer: customer });

            return res.status(200).json({ count: orders });
        } catch (error) {
            next(error);
        }
    }

    async DataByMonth(req, res, next) {
        try {
            // Ordes by month
            const OrdersByMonth = await Orders.aggregate([
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        total: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
            ]);
            // Users by month
            const UsersByMonth = await Users.aggregate([
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        total: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
            ]);
            return res.json({ OrdersByMonth, UsersByMonth });
        } catch (error) {
            next(error);
        }
    }
    async recentOrders(req, res, next) {
        try {
            const orders = await Orders.find().sort({ createdAt: -1 }).limit(10).select("-address -orderRegistration").populate();
            return res.status(200).json({ orders: orders });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new EstatisticController();
