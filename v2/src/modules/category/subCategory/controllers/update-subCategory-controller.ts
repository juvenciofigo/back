import { NextFunction, Response } from "express";
import { makeUpdateSubCategory } from "../../index.js";
import { Request } from "express-jwt";

export async function updateSubCategoryController(req: Request, res: Response, next: NextFunction) {
    const { subCategoryName, availability } = req.body;
    const subCategoryId = req.params.subCategoryId || "";
    const categoryId = req.params.categoryId || "";

    try {
        const subCategory = await makeUpdateSubCategory()
            .execute(
                {
                    subCategoryName,
                    availability,
                    subCategoryId,
                    categoryId
                });

        return res.status(200).json(subCategory);
    } catch (error) {
        next(error);
    }
}
