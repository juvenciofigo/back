import { NextFunction, Response } from "express";
import { makeCreateAddress } from "../index.js";
import { Request } from "express-jwt";

export async function createAddressController(req: Request, res: Response, next: NextFunction) {
    const userId = req.auth?._id;
    const { complete, city, province, neighborhood, reference, note, cellNumber } = req.body;

    try {
        const address = await makeCreateAddress().execute({
            userId,
            complete,
            city,
            province,
            neighborhood,
            reference,
            note,
            cellNumber,
        });

        return res.status(201).json(address);
    } catch (error) {
        next(error);
    }
}
