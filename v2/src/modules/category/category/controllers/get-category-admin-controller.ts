import { NextFunction, Response } from "express";
import { makeGetCategoryAdmin } from "../../index.js";
import { Request } from "express-jwt";

export async function getCategoryAdminController(req: Request, res: Response, next: NextFunction) {
    const categoryId = req.params.categoryId || "";
    try {
        const category = await makeGetCategoryAdmin().execute(categoryId);

        return res.status(200).json(category);
    } catch (error) {
        next(error);
    }
}
