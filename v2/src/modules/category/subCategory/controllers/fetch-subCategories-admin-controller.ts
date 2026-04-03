import { NextFunction, Response } from "express";
import { makeFetchSubCategoriesAdmin } from "../../index.js";
import { Request } from "express-jwt";

export async function fetchSubCategoriesAdminController(req: Request, res: Response, next: NextFunction) {
    try {
        const subcategories = await makeFetchSubCategoriesAdmin().execute(req);

        return res.status(200).json(subcategories);
    } catch (error) {
        next(error);
    }
}
