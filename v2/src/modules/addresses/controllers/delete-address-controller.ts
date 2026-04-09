import { NextFunction, Response } from "express";
import { makeDeleteAddress } from "../index.js";
import { Request } from "express-jwt";

export async function deleteAddressController(req: Request, res: Response, next: NextFunction) {
    const addressId = req.params.addressId as string;

    try {
        await makeDeleteAddress().execute({ addressId });

        return res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
}
