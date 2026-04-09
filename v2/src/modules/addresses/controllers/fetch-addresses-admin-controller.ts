import { NextFunction, Response } from "express";
import { makeFetchAddressesAdmin } from "../factories/make-fetch-addresses-admin.js";
import { Request } from "express-jwt";

export async function fetchAddressesAdminController(req: Request, res: Response, next: NextFunction) {
    try {
        const addresses = await makeFetchAddressesAdmin().execute(req);

        return res.status(200).json(addresses);
    } catch (error) {
        next(error);
    }
}
