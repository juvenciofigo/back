import { NextFunction, Response } from "express";
import { makeDeleteSubCategory } from "../../index.js";
import { Request } from "express-jwt";

export async function deleteSubCategoryController(req: Request, res: Response, next: NextFunction) {
    const subCategoryId = req.params.subCategoryId as string;

    try {
        await makeDeleteSubCategory().execute({ subCategoryId });

        return res.status(200).json({ success: true, message: "SubCategory deleted!" });
    } catch (error) {
        next(error);
    }
}
