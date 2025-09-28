import { NextFunction, Response } from "express";
import { makeCreateCategory } from "../index.js";
import { Request } from "express-jwt";

export async function createCategoryController(req: Request, res: Response, next: NextFunction) {
    const { categoryName } = req.body;

    try {
        const category = await makeCreateCategory().execute({ categoryName });

        return res.status(201).json(category);
    } catch (error) {
        next(error);
    }
}
