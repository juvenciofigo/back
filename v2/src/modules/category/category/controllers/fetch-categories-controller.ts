import { NextFunction, Response } from "express";
import { makeFetchCategories } from "../../index.js";
import { Request } from "express-jwt";

export async function fetchCategoriesController(req: Request, res: Response, next: NextFunction) {
    try {
        const categories = await makeFetchCategories().execute(req);

        return res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
}
