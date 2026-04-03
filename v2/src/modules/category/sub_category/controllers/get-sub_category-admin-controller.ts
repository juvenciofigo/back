import { NextFunction, Response } from "express";
import { makeGetSub_categoryAdmin } from "../../index.js";
import { Request } from "express-jwt";

export async function getSub_categoryAdminController(req: Request, res: Response, next: NextFunction) {
    const sub_categoryId = req.params.sub_categoryId || "";

    try {
        const sub_category = await makeGetSub_categoryAdmin().execute(sub_categoryId);

        return res.status(200).json(sub_category);
    } catch (error) {
        next(error);
    }
}
