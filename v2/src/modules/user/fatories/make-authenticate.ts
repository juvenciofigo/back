import { AuthtenticationService, MongooseUserRepository } from "../index.js";

export function makeAuthenticate() {
    const mongooseUserRepository = new MongooseUserRepository();
    const authenticateService = new AuthtenticationService(mongooseUserRepository);

    return authenticateService;
}
