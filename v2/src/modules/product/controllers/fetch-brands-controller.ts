import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { makeFetchBrands } from "../index.js";

export async function fetchBrandsController(req: Request, res: Response, next: NextFunction) {
    try {
        const brands = await makeFetchBrands().execute();

        return res.status(200).json(brands);
    } catch (error) {
        next(error);
    }
}
