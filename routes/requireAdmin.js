var { expressjwt: jwt } = require("express-jwt");
const secret = require("../config").secret;

function requireAdmin(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: "Token não fornecido." });
    }
    console.log(jwt);

    // Verificar e decodificar o token
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Token inválido." });
        }

        // Verificar se a role "admin" está presente no payload
        if (!decoded || !decoded.role || decoded.role !== "admin") {
            return res.status(403).json({ error: "Acesso negado. Função de administrador necessária." });
        }

        // Se o usuário é um administrador, permitir o acesso
        next();
    });
    
}



module.exports = requireAdmin;
