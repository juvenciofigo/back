import { NextFunction, Response } from "express";
import { makeFetchSubCategories } from "../../index.js";
import { Request } from "express-jwt";

export async function fetchSubCategoriesController(req: Request, res: Response, next: NextFunction) {
    try {
        const subcategories = await makeFetchSubCategories().execute(req);

        return res.status(200).json(subcategories);
    } catch (error) {
        next(error);
    }
}
