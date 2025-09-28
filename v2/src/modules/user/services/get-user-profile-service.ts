import { IUser, UserNotFoundError, UserRepository } from "../index.js";
interface Request {
    userId: string;
}

export class GetUserServive {
    private usersRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.usersRepository = userRepository;
    }

    async execute({ userId }: Request): Promise<IUser | null> {
        const user = await this.usersRepository.findByID(userId);

        if (!user) {
            throw new UserNotFoundError();
        }

        return user;
    }
}
