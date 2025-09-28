import { DeleteUserService, MongooseUserRepository } from "../index.js";

export function makeDeleteUser() {
    const mongooseUserRepository = new MongooseUserRepository();
    const deleteUserService = new DeleteUserService(mongooseUserRepository);

    return deleteUserService;
}
