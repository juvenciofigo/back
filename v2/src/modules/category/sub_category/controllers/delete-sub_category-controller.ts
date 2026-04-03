import { NextFunction, Response } from "express";
import { makeDeleteSub_category } from "../../index.js";
import { Request } from "express-jwt";

export async function deleteSub_categoryController(req: Request, res: Response, next: NextFunction) {
    const sub_categoryId = req.params.sub_categoryId as string;

    try {
        await makeDeleteSub_category().execute({ sub_categoryId });

        return res.status(200).json({ success: true, message: "SubCategory deleted!" });
    } catch (error) {
        next(error);
    }
}
