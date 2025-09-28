import { NextFunction, Request, Response } from "express";
import { makeRegisterUser } from "../index.js";

export async function registerUserController(req: Request, res: Response, next: NextFunction) {
    try {
        const registerUser = await makeRegisterUser().execute(req.body);

        return res.status(200).send(registerUser);
    } catch (error: unknown) {
        next(error);
    }
}
