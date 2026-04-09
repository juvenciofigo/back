import { NextFunction, Response } from "express";
import { makeUpdateAddress } from "../factories/make-update-address.js";
import { Request } from "express-jwt";

export async function updateAddressController(req: Request, res: Response, next: NextFunction) {
    const addressId = req.params.addressId as string;
    const { complete, city, province, neighborhood, reference, note, cellNumber } = req.body;

    try {
        const address = await makeUpdateAddress().execute({
            addressId,
            complete,
            city,
            province,
            neighborhood,
            reference,
            note,
            cellNumber,
        });

        return res.status(200).json(address);
    } catch (error) {
        next(error);
    }
}
