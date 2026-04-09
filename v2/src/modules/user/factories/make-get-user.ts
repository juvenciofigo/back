import { GetUserService, MongooseUserRepository } from "../index.js";

export function makeGetUser() {
    const mongooseUserRepository = new MongooseUserRepository();
    const getUserService = new GetUserService(mongooseUserRepository);
    
    return getUserService;
}
