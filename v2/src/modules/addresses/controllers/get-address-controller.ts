import { NextFunction, Response } from "express";
import { makeGetAddress } from "../factories/make-get-address.js";
import { Request } from "express-jwt";

export async function getAddressController(req: Request, res: Response, next: NextFunction) {
    const addressId = req.params.addressId as string;

    try {
        const address = await makeGetAddress().execute({ addressId });

        return res.status(200).json(address);
    } catch (error) {
        next(error);
    }
}
