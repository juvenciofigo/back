export default {
    secret: process.env.SECRET || "minhaChaveSecretaSuperSegura",
    api: process.env.NODE_ENV === "production" ? process.env.URI : "http://localhost:3000",
    loja: process.env.NODE_ENV === "production" ? "https://cuddly-tigers-help.loca.lt" : "http://localhost:8000",
};
