import { NextFunction, Response } from "express";
import { makeFetchSubcateriesByCategory } from "../index.js";
import { Request } from "express-jwt";

export async function fetchSubcategoriesByCategoryController(req: Request, res: Response, next: NextFunction) {
    const categoryId = req.params.categoryId || "";
    try {
        const subcategories = await makeFetchSubcateriesByCategory().execute({ categoryId });

        return res.status(200).json(subcategories);
    } catch (error) {
        next(error);
    }
}
