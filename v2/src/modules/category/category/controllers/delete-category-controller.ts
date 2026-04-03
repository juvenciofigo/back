import { NextFunction, Response } from "express";
import { makeDeleteCategory } from "../../index.js";
import { Request } from "express-jwt";

export async function deleteCategoryController(req: Request, res: Response, next: NextFunction) {
    const categoryId = req.params.categoryId as string;

    try {
        await makeDeleteCategory().execute({ categoryId });

        return res.status(200).json({ success: true, message: "Category deleted!" });
    } catch (error) {
        next(error);
    }
}
