import { GetUserProfileService, MongooseUserRepository } from "../index.js";

export function makeAuthenticate() {
    const mongooseUserRepository = new MongooseUserRepository();
    const getUserProfileService = new GetUserProfileService(mongooseUserRepository);

    return getUserProfileService;
}
