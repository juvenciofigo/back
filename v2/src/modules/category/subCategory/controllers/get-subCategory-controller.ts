import { NextFunction, Response } from "express";
import { makeGetSubCategory } from "../../index.js";
import { Request } from "express-jwt";

export async function getSubCategoryController(req: Request, res: Response, next: NextFunction) {
    const subCategoryId = req.params.subCategoryId || "";

    try {
        const subcategory = await makeGetSubCategory().execute(subCategoryId);

        return res.status(200).json(subcategory);
    } catch (error) {
        next(error);
    }
}
