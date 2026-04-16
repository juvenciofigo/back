import { NextFunction, Response } from "express";
import { makeGetUser } from "../index.js";
import { Request } from "express-jwt";

export async function getUserController(req: Request, res: Response, next: NextFunction) {
    const authId = req?.auth?._id;

    try {
        const getUserProfileService = await makeGetUser().execute({ userId: authId });

        return res.status(200).send(getUserProfileService);
    } catch (error: unknown) {
        next(error);
    }
}
