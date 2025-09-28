import { NextFunction, Response } from "express";
import { makeFetchSub_categoriesBySubCategory } from "../index.js";
import { Request } from "express-jwt";

export async function fetchSub_categoriesBySubCategoryController(req: Request, res: Response, next: NextFunction) {
    const subCategoryId = req.params.subCategoryId || "";
    try {
        const sub_categories = await makeFetchSub_categoriesBySubCategory().execute({ subCategoryId });

        return res.status(200).json(sub_categories);
    } catch (error) {
        next(error);
    }
}
