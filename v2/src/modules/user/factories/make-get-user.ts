import { GetUserServive, MongooseUserRepository } from "../index.js";

export function makeGetUser() {
    const mongooseUserRepository = new MongooseUserRepository();
    const getUserService = new GetUserServive(mongooseUserRepository);
    
    return getUserService;
}
