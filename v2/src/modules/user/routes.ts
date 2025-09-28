import { Router } from "express";
const router = Router();
import {
    registerUserValitaror,
    getUserValidator,
    updateUserValidator,
    //
    registerUserController,
    authenticateUser,
    getUsersController,
    authtenticationController,
    getUserProfileController,
    deleteUserController,
    updateUserController,
    IsAuthValidator,
    IsAdminValidator,
} from "./index.js";

////////// Admin ///////////

// obter todos os usuários
router.get("/users/admin", IsAuthValidator.require, IsAdminValidator, getUsersController); // testado

// obter detalhes de um usuário específico
// router.get("/user/:id/admin", auth.require, AdminValidator, UserValidation.show, UserController.getUserDetails); // testado

// // atualizar informações de um usuário
// router.put("/user/:id/admin", auth.require, AdminValidator, UserValidation.update, UserController.updateUser); // nao aprovado

// //Delete a user.
// router.delete("/user/:id/ admin", auth.require, AdminValidator, AdminValidator, UserController.deleteUser); // testado

// //

// //////////// Client //////////
// // visitante
// router.get("/visitaReg", UserController.visitaReg);

// // obter detalhes de um usuário específico
// router.get("/user/:id", auth.require, UserValidation.show, UserController.getUserDetails); // testado

router.get("/user/:id", IsAuthValidator.require, getUserValidator, getUserProfileController); // testado

// // atualizar informações de um usuário
router.put("/user/:id", IsAuthValidator.require, updateUserValidator, updateUserController); // nao aprovado

// //Delete a user.
router.delete("/user/:id", IsAuthValidator.require, deleteUserController); // testado

router.post("/authetication", authenticateUser, authtenticationController); //testado

router.post("/register", registerUserValitaror, registerUserController); // testado

// // recuperacao de senha
// // solicitar recuperação de senha
// router.get("/showRecovery", UserController.showRecovery); // testado

// // iniciar o processo de recuperação de senha
// router.post("/createRecovery", UserValidation.createRecovery, UserController.initiateRecovery); // testado

// // completar a recuperação de senha
// router.get("/recoverPass", UserController.GetCompleteRecovery); // testado

// // para concluir a recuperação de senha
// router.post("/recoverPass", UserController.completeRecovery); // testado

export default router;
