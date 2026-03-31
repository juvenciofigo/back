import { NextFunction, Request, Response } from "express";
import { makeGetOrdersByCustomer } from "../index.js";

export async function getOrdersByCustomerController(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.userId || "";
    try {
        const stats = await makeGetOrdersByCustomer().execute(userId);
        return res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
}
