import { NextFunction, Response } from "express";
import { makeFetchSub_categories } from "../../index.js";
import { Request } from "express-jwt";

export async function fetchSub_categoriesController(req: Request, res: Response, next: NextFunction) {


    try {
        const sub_categories = await makeFetchSub_categories().execute(req);

        return res.status(200).json(sub_categories);
    } catch (error) {
        next(error);
    }
}
