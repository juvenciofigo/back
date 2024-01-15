module.exports = {
    secret: process.env.NODE_ENV === "production" ? process.env.SECRET : "SFDFAFADFSD8FAD1FAD5FA8FDFADAF3DF4ADF55FDASF5DF4ADF2DFA5DF7ADF8A5DFAFA1DF4EF4ADF4DGFGF5GA5GFG5FGH",
    api: process.env.NODE_ENV === "production" ? "https://api.com" : "htpps//localhost:3000",
    loja: process.env.NODE_ENV === "prodution" ? "https://api.com" : "htpps//localhost:8000",
};
