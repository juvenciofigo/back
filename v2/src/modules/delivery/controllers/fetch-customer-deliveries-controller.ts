import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { makeFetchCustomerDeliveries } from "../factories/make-fetch-customer-deliveries.js";

export async function fetchCustomerDeliveriesController(req: Request, res: Response, next: NextFunction) {
    const customerId = req.auth?.id; // Obtido do Token JWT

    try {
        const result = await makeFetchCustomerDeliveries().execute(customerId!, req.query);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
