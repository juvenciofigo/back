// import Users from "../../models/Users.js";
import { Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors.js";
import { makeGetUser } from "src/modules/user/index.js";
import { Request } from "express-jwt";

export async function IsAdminValidator(req: Request, _res: Response, next: NextFunction) {
    try {
        if (!req?.auth) {
            throw new UnauthorizedError();
        }

        const id = req.auth?._id;

        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            throw new UnauthorizedError();
        }

        const user = await makeGetUser().execute({ userId: id });

        if (!user || !user?.role?.includes("admin")) {
            throw new UnauthorizedError();
        }
        next();
    } catch (error) {
        next(error);
    }
}
