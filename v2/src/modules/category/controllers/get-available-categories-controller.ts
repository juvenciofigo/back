import { NextFunction, Response } from "express";
import { makeGetAvailableCategories } from "../index.js";
import { Request } from "express-jwt";

export async function getAvailableCategoriesController(req: Request, res: Response, next: NextFunction) {
    try {
        const categories = await makeGetAvailableCategories().execute();

        return res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
}
