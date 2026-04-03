import { NextFunction, Response } from "express";
import { makeGetSubCategoryAdmin } from "../../index.js";
import { Request } from "express-jwt";

export async function getSubCategoryAdminController(req: Request, res: Response, next: NextFunction) {
    const subCategoryId = req.params.subCategoryId || "";

    try {
        const subCategory = await makeGetSubCategoryAdmin().execute(subCategoryId);

        return res.status(200).json(subCategory);
    } catch (error) {
        next(error);
    }
}
