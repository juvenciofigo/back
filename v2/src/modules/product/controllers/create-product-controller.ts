import { NextFunction, Response } from "express";
import { makeCreateProduct } from "../index.js";
import { Request } from "express-jwt";

export async function createProductController(req: Request, res: Response, next: NextFunction) {
    const userId = req.auth?._id;
    let images: Express.Multer.File[] = [];
    if (req.files) {
        if (Array.isArray(req.files)) {
            images = req.files;
        } else {
            images = Object.values(req.files).flat();
        }
    }
    const data = req.body;

    try {
        const product = await makeCreateProduct().execute({ data, images, userId });

        return res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}
