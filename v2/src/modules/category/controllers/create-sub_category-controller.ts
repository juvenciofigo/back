import { NextFunction, Response } from "express";
import { makeCreateSub_category } from "../index.js";
import { Request } from "express-jwt";

export async function createSub_categoryController(req: Request, res: Response, next: NextFunction) {
    const { sub_categoryName, subCategoryID } = req.body;

    try {
        const category = await makeCreateSub_category().execute({ sub_categoryName, subCategoryID });

        return res.status(201).json(category);
    } catch (error) {
        next(error);
    }
}
