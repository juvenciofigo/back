import { FetchUsersService, MongooseUserRepository } from "../index.js";

export function makeFetchUsers() {
    const mongooseUserRepository = new MongooseUserRepository();
    const fetchUsersService = new FetchUsersService(mongooseUserRepository);

    return fetchUsersService;
}
