var router = require("express").Router();
var UserController = require("../controllers/UserController");
const UserValidation = require("../controllers/validations/userValidation");
const AdminValidator = require("../controllers/validations/adminValidator");
const CustomerValidator = require("../controllers/validations/customerValidator");

const auth = require("./auth");

// autenticar um usuário

router.post("/login", UserValidation.authenticateUser, UserController.authenticateUser); //testado

// criar um novo usuário
router.post("/user", UserValidation.create, UserController.createUser); // testado

//

// // // // // //  recuperacao de senha // // // // // //

// solicitar recuperação de senha
router.get("/showRecovery", UserController.showRecovery); // testado

// iniciar o processo de recuperação de senha
router.post("/createRecovery", UserController.initiateRecovery); // testado

// completar a recuperação de senha
router.get("/recoverPass", UserController.GetCompleteRecovery); // testado

// para concluir a recuperação de senha
router.post("/recoverPass", UserController.completeRecovery); // testado

// // // // // Rotas protegidas // // // // //

// obter todos os usuários
router.get("/users", auth.require, AdminValidator, UserController.getAllUsers); // testado

// obter detalhes de um usuário específico
router.get("/user/:id", auth.require, UserValidation.show, UserController.getUserDetails); // testado

// atualizar informações de um usuário
router.put("/user/:id", auth.require, UserValidation.update, UserController.updateUser); // nao aprovado

//Delete a user.
router.delete("/user/:id", auth.require, AdminValidator, UserController.deleteUser); // testado

module.exports = router;
