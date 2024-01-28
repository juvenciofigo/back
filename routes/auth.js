var { expressjwt: jwt } = require("express-jwt");
const secret = require("../config").secret;

function getTokenFromHeader(req) {
    if (!req.headers.authorization) return null;

    const token = req.headers.authorization.split(" ");

    if (token.length !== 2 || token[0] !== "Ecommerce") return null;

    return token[1];
}

const auth = {
    require: jwt({
        secret,
        userProperty: "payload",
        algorithms: ["HS256"],
        getToken: getTokenFromHeader,
    }),
    optional: jwt({
        secret,
        userProperty: "payload",
        credentialRequired: false,
        algorithms: ["HS256"],
        getToken: getTokenFromHeader,
    }),
};

module.exports = auth;
