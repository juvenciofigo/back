import { NextFunction, Response } from "express";
import { makeFetchAddresses } from "../factories/make-fetch-addresses.js";
import { Request } from "express-jwt";

export async function fetchAddressesController(req: Request, res: Response, next: NextFunction) {
    try {
        const addresses = await makeFetchAddresses().execute(req);

        return res.status(200).json(addresses);
    } catch (error) {
        next(error);
    }
}
