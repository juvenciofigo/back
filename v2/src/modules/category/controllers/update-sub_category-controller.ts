import { NextFunction, Response } from "express";
import { makeUpdateSub_category } from "../index.js";
import { Request } from "express-jwt";

export async function updateSub_categoryController(req: Request, res: Response, next: NextFunction) {
    const { sub_categoryName, availability, products } = req.body;
    const subCategoryId = req.params.subCategoryId || "";
    const sub_categoryId = req.params.sub_categoryId || "";

    try {
        const subCategory = await makeUpdateSub_category().execute({ sub_categoryName, availability, products, subCategoryId, sub_categoryId });

        return res.status(200).json(subCategory);
    } catch (error) {
        next(error);
    }
}
