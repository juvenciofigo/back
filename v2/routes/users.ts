import { Router } from "express";
const router = Router();

import UserController from "../controllers/UserControllert.js";
import UserValidation from "../controllers/validations/userValidation.js";
import AdminValidator from "../controllers/validations/adminValidator.js";

import auth from "./auth.js";

////////// Admin ///////////

// obter todos os usuários
// router.get("/users/admin", auth.require, AdminValidator, UserController.getAllUsers); // testado

// obter detalhes de um usuário específico
// router.get("/user/:id/admin", auth.require, AdminValidator, UserValidation.show, UserController.getUserDetails); // testado

// atualizar informações de um usuário
router.put("/user/:id/admin", auth.require, AdminValidator, UserValidation.update, UserController.updateUser); // nao aprovado

//Delete a user.
router.delete("/user/:id/ admin", auth.require, AdminValidator, AdminValidator, UserController.deleteUser); // testado

//

//////////// Client //////////
// visitante
router.get("/visitaReg", UserController.visitaReg);

// obter detalhes de um usuário específico
// router.get("/user/:id", auth.require, UserValidation.show, UserController.getUserDetails); // testado

// atualizar informações de um usuário
router.put("/user/:id", auth.require, UserValidation.update, UserController.updateUser); // nao aprovado

//Delete a user.
// router.delete("/user/:id", auth.require, AdminValidator, UserController.deleteUser); // testado

// router.post("/signIn", UserValidation.authenticateUser, UserController.authenticateUser); //testado

// router.post("/signUp", UserValidation.create, UserController.createUser); // testado

// recuperacao de senha
// solicitar recuperação de senha
router.get("/showRecovery", UserController.showRecovery); // testado

// iniciar o processo de recuperação de senha
router.post("/createRecovery", UserValidation.createRecovery, UserController.initiateRecovery); // testado

// completar a recuperação de senha
router.get("/recoverPass", UserController.GetCompleteRecovery); // testado

// para concluir a recuperação de senha
router.post("/recoverPass", UserController.completeRecovery); // testado

export default router;
