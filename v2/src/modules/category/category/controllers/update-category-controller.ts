import { NextFunction, Response } from "express";
import { makeUpdateCategory } from "../../index.js";
import { Request } from "express-jwt";

export async function updateCategoryController(req: Request, res: Response, next: NextFunction) {
    const { categoryName, availability, } = req.body;
    const categoryId = req.params.categoryId || "";

    try {
        const category = await makeUpdateCategory().execute({ categoryName, availability, categoryId });

        return res.status(200).json(category);
    } catch (error) {
        next(error);
    }
}
