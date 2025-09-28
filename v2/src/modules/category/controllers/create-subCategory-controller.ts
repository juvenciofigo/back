import { NextFunction, Response } from "express";
import { makeCreateSubCategory } from "../index.js";
import { Request } from "express-jwt";

export async function createSubCategoryController(req: Request, res: Response, next: NextFunction) {
    const { subCategoryName, categoryId } = req.body;

    try {
        const category = await makeCreateSubCategory().execute({ subCategoryName, categoryId });

        return res.status(201).json(category);
    } catch (error) {
        next(error);
    }
}
