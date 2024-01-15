var express = require("express");
var router = express.Router();
var UserController = require("../controllers/UserController");
const auth = require("./auth");

router.post("/login", UserController.authenticateUser); // autenticar um usuário
router.post("/users", UserController.createUser); // criar um novo usuário

// recuperacao de senha

// // solicitar recuperação de senha
router.get("/recoveryPass", UserController.showRecovery);

// //iniciar o processo de recuperação de senha
router.post("/recoveryPass ", UserController.initiateRecovery);

// // completar a recuperação de senha
router.get("/reververedPass", UserController.completeRecovery);

// // para concluir a recuperação de senha
router.post("/reververedPass", UserController.completeRecovery);


// Rotas protegidas
router.use(auth.require);

// obter todos os usuários
router.get("/users", UserController.getAllUsers);

// obter detalhes de um usuário específico
router.get("/user/:id", UserController.getUserDetails);

// atualizar informações de um usuário
router.put("/user/:id", UserController.updateUser);

//Delete a user.

router.delete("/user/:id", UserController.deleteUser);


module.exports = router;
