import { NextFunction, Response } from "express";
import { makeFetchCategory } from "../index.js";
import { Request } from "express-jwt";

export async function fetchCategoryController(req: Request, res: Response, next: NextFunction) {
    const categoryId = req.params.categoryId || "";
    try {
        const category = await makeFetchCategory().execute({ categoryId });

        return res.status(200).json( category);
    } catch (error) {
        next(error);
    }
}
