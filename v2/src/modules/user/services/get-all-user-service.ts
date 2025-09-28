import { IUser, UserRepository } from "../index.js";

interface Response {
    users: IUser[];
    count: number;
}

export class GetAllUserService {
    private usersRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.usersRepository = userRepository;
    }

    async execute(): Promise<Response> {
        const users = await this.usersRepository.getUsers();

        return { count: users.length, users };
    }
}
