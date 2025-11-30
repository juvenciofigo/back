import { NextFunction, Response } from "express";
import { makeUpdateProduct } from "../index.js";
import { Request } from "express-jwt";

export async function updateProductController(req: Request, res: Response, next: NextFunction) {
    const userId = req.auth?._id;
    const productId = req.params.productId || "";
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
        const product = await makeUpdateProduct().execute({ data, images, userId, productId });

        return res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}
