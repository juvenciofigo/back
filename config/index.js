module.exports = {
    secret: "SFDFAFADFSD8FAD1FAD5FA8FDFADAF3DF4ADF55FDASF5DF4ADF2DFA5DF7ADF8A5DFAFA1DF4EF4ADF4DGFGF5GA5GFG5FGHHH",
    api:  process.env.NODE_ENV === "production" ? process.env.URI : "http://localhost:3000",
    loja: process.env.NODE_ENV === "production" ? "https://loja-teste.ampliee.com" : "http://localhost:8000",
};
