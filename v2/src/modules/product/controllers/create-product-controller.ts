import { NextFunction, Response } from "express";
import { makeCreateProduct } from "../index.js";
import { Request } from "express-jwt";

export async function createProductController(req: Request, res: Response, next: NextFunction) {
    const userId = req?.auth?._id;

    try {
        const product = await makeCreateProduct().execute();

        return res.status(200).json();
    } catch (error) {
        next(error);
    }
}
