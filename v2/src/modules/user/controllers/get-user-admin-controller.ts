import { NextFunction, Response } from "express";
import { makeGetUser } from "../index.js";
import { Request } from "express-jwt";

export async function getUserAdminController(req: Request, res: Response, next: NextFunction) {
    const userId = req.query.userId as string;
    const firstName = req.query.firstName as string;
    const lastName = req.query.lastName as string;
    const email = req.query.email as string;
    const customer = req.query.customer as string;
    const cart = req.query.cart as string;
    const deleted = req.query.deleted as unknown as boolean;

    try {
        const getUserProfileService = await makeGetUser().execute({
            userId,
            firstName,
            lastName,
            email,
            customer,
            cart,
            deleted
        });

        return res.status(200).send(getUserProfileService);
    } catch (error: unknown) {
        next(error);
    }
}
