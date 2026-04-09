import { NextFunction, Response } from "express";
import { makeGetAddressAdmin } from "../factories/make-get-address-admin.js";
import { Request } from "express-jwt";

export async function getAddressAdminController(req: Request, res: Response, next: NextFunction) {
    const addressId = req.params.addressId as string;

    try {
        const address = await makeGetAddressAdmin().execute({ addressId });

        return res.status(200).json(address);
    } catch (error) {
        next(error);
    }
}
