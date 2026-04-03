import { NextFunction, Response } from "express";
import { makeFetchCategoriesAdmin } from "../../index.js";
import { Request } from "express-jwt";

export async function fetchCategoriesAdminController(req: Request, res: Response, next: NextFunction) {
    try {
        const categories = await makeFetchCategoriesAdmin().execute(req);

        return res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
}
