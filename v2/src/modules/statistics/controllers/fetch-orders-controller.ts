import { Request, Response, NextFunction } from "express";
import { makeFetchOrders } from "../factories/make-fetch-orders.js";

export async function fetchOrdersController(req: Request, res: Response, next: NextFunction) {
    try {
        const fetchOrdersService = makeFetchOrders();
        const result = await fetchOrdersService.execute(req);

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
