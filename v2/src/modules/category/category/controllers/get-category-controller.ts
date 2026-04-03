import { NextFunction, Response } from "express";
import { makeGetCategory } from "../../index.js";
import { Request } from "express-jwt";

export async function getCategoryController(req: Request, res: Response, next: NextFunction) {
    const categoryId = req.params.categoryId || "";
    try {
        const category = await makeGetCategory().execute(categoryId);

        return res.status(200).json(category);
    } catch (error) {
        next(error);
    }
}
