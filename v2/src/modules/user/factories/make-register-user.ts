import { RegisterUserService, MongooseUserRepository } from "../index.js";

export function makeRegisterUser() {
    const mongooseUserRepository = new MongooseUserRepository();
    const registerUserService = new RegisterUserService(mongooseUserRepository);

    return registerUserService;
}
