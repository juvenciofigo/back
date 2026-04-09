import { InvalidCredentialsError, UserNotFoundError, IUserRepository } from "../index.js";

interface Request {
    userId: string;
}

export class DeleteUserService {
    private usersRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.usersRepository = userRepository;
    }

    async execute({ userId }: Request): Promise<boolean> {
        const user = await this.usersRepository.deleteUser(userId);

        if (!user || user.deleted === true) {
            throw new InvalidCredentialsError();
        }

        if (!user) {
            throw new UserNotFoundError();
        }

        return true;
    }
}
