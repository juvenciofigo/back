import { expressjwt, Request } from "express-jwt";

const secretCode: string = process.env.SECRET || "MinhaSenha";

function getTokenFromHeader(req: Request) {
    if (!req.headers.authorization) return null;

    const token = req.headers.authorization.split(" ");

    if (token.length !== 2 || token[0] !== "Ecommerce") return null;

    return token[1];
}

const IsAuthValidator = {
    require: expressjwt({
        secret: secretCode,
        algorithms: ["HS256"],
        getToken: getTokenFromHeader,
    }),
    optional: expressjwt({
        secret: secretCode,
        credentialsRequired: false,
        algorithms: ["HS256"],
        getToken: getTokenFromHeader,
    }),
};

export { IsAuthValidator };
