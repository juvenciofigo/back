import { NextFunction, Response } from "express";
import { makeFetchSubCategory } from "../index.js";
import { Request } from "express-jwt";

export async function fetchSubcategoryController(req: Request, res: Response, next: NextFunction) {
    const subCategoryId = req.params.subCategoryId || "";

    try {
        const subcategory = await makeFetchSubCategory().execute({ subCategoryId });

        return res.status(200).json(subcategory);
    } catch (error) {
        next(error);
    }
}
