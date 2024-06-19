var router = require("express").Router();
var UserController = require("../controllers/UserController");
const UserValidation = require("../controllers/validations/userValidation");
const AdminValidator = require("../controllers/validations/adminValidator");
const CustomerValidator = require("../controllers/validations/customerValidator");

const auth = require("./auth");

router.get("/", UserController.default);

////////// Admin ///////////

// obter todos os usuários
router.get("/users/admin", auth.require, AdminValidator, UserController.getAllUsers); // testado

// obter detalhes de um usuário específico
router.get("/user/:id/admin", auth.require, AdminValidator, UserValidation.show, UserController.getUserDetails); // testado

// atualizar informações de um usuário
router.put("/user/:id/admin", auth.require, AdminValidator, UserValidation.update, UserController.updateUser); // nao aprovado

//Delete a user.
router.delete("/user/:id/ admin", auth.require, AdminValidator, AdminValidator, UserController.deleteUser); // testado

//

//////////// Client //////////


// obter detalhes de um usuário específico
router.get("/user/:id", auth.require, UserValidation.show, UserController.getUserDetails); // testado

// atualizar informações de um usuário
router.put("/user/:id", auth.require, UserValidation.update, UserController.updateUser); // nao aprovado

//Delete a user.
router.delete("/user/:id", auth.require, AdminValidator, UserController.deleteUser); // testado

router.post("/login", UserValidation.authenticateUser, UserController.authenticateUser); //testado

router.post("/user", UserValidation.create, UserController.createUser); // testado

// solicitar recuperação de senha
router.get("/showRecovery", UserController.showRecovery); // testado

// iniciar o processo de recuperação de senha
router.post("/createRecovery", UserController.initiateRecovery); // testado

// completar a recuperação de senha
router.get("/recoverPass", UserController.GetCompleteRecovery); // testado

// para concluir a recuperação de senha
router.post("/recoverPass", UserController.completeRecovery); // testado

module.exports = router;
