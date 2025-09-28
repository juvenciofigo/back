import { NextFunction, Request, Response } from "express";
import { makeAuthenticate } from "../index.js";

export async function authtenticationController(req: Request, res: Response, next: NextFunction) {
    try {
        const authenticateService = await makeAuthenticate().execute(req.body);

        return res.status(200).send(authenticateService);
    } catch (error: unknown) {
        next(error);
    }
}
