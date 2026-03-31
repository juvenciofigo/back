import { AuthenticationService, MongooseUserRepository } from "../index.js";

export function makeAuthenticate() {
    const mongooseUserRepository = new MongooseUserRepository();
    const authenticateService = new AuthenticationService(mongooseUserRepository);

    return authenticateService;
}
