import { NextFunction, Response } from "express";
import { makeFetchSub_category } from "../index.js";
import { Request } from "express-jwt";

export async function fetchSub_categoryController(req: Request, res: Response, next: NextFunction) {
    const sub_categoryId = req.params.sub_categoryId || "";

    try {
        const subcategory = await makeFetchSub_category().execute({ sub_categoryId });

        return res.status(200).json(subcategory);
    } catch (error) {
        next(error);
    }
}
