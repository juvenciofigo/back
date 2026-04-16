import { Router } from "express";
const router = Router();
import {
    // validators
    registerUserValidator,
    getUserValidator,
    updateUserValidator,
    IsAuthValidator,
    IsAdminValidator,
    //
    registerUserController,
    authenticateUserValidator,

    // admin
    fetchUsersController,
    getUserAdminController,
    deleteUserController,
    updateUserController,
    // client
    authenticationController,
    fetchUsersValidator,
    getUserController,
} from "./index.js";

////////// Admin ///////////

// obter todos os usuários
router.get("/users", IsAuthValidator.require, IsAdminValidator, fetchUsersValidator, fetchUsersController); //✅

// obter detalhes de um usuário específico
router.get("/user/:id/admin", IsAuthValidator.require, IsAdminValidator, getUserValidator, getUserAdminController);

// // atualizar informações de um usuário
// router.put("/user/:id/admin", auth.require, AdminValidator, UserValidation.update, UserController.updateUser);

// //Delete a user.
// router.delete("/user/:id/ admin", auth.require, AdminValidator, AdminValidator, UserController.deleteUser);

// //

// //////////// Client //////////
// // visitante
// router.get("/visitaReg", UserController.visitaReg);

// // obter detalhes de um usuário específico
// router.get("/user/:id", auth.require, UserValidation.show, UserController.getUserDetails);

router.post("/authentication", authenticateUserValidator, authenticationController); //✅

router.get("/user/:id", IsAuthValidator.require, getUserValidator, getUserController);

// // atualizar informações de um usuário
router.put("/user/:id", IsAuthValidator.require, updateUserValidator, updateUserController);

// //Delete a user.
router.delete("/user", IsAuthValidator.require, deleteUserController); //✅

router.post("/register", registerUserValidator, registerUserController); //✅

// // recuperacao de senha
// // solicitar recuperação de senha
// router.get("/showRecovery", UserController.showRecovery);

// // iniciar o processo de recuperação de senha
// router.post("/createRecovery", UserValidation.createRecovery, UserController.initiateRecovery);

// // completar a recuperação de senha
// router.get("/recoverPass", UserController.GetCompleteRecovery);

// // para concluir a recuperação de senha
// router.post("/recoverPass", UserController.completeRecovery);

export default router;
