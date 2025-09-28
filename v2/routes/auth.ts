import { expressjwt } from "express-jwt";
import { Request } from "express";
import secret from "../config/index.js";
const secretCode: string = secret.secret;

function getTokenFromHeader(req: Request) {
    if (!req.headers.authorization) return null;

    const token = req.headers.authorization.split(" ");

    if (token.length !== 2 || token[0] !== "Ecommerce") return null;
    return token[1];
}

const auth = {
    require: expressjwt({
        secret: secretCode,
        userProperty: "auth",
        algorithms: ["HS256"],
        getToken: getTokenFromHeader,
    }),
    optional: expressjwt({
        secret: secretCode,
        userProperty: "auth",
        credentialsRequired: false,
        algorithms: ["HS256"],
        getToken: getTokenFromHeader,
    }),
};

export default auth;
