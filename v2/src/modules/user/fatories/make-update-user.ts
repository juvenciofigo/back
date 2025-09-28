import { UpdateUserService, MongooseUserRepository } from "../index.js";

export function makeUpdateUser() {
    const mongooseUserRepository = new MongooseUserRepository();
    const updateUserService = new UpdateUserService(mongooseUserRepository);

    return updateUserService;
}
