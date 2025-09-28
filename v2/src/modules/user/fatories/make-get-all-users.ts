import { GetAllUserService, MongooseUserRepository } from "../index.js";

export function makeGetAllUser() {
    const mongooseUserRepository = new MongooseUserRepository();
    const getAllUserService = new GetAllUserService(mongooseUserRepository);
    
    return getAllUserService;
}
