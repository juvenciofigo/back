import { GenerateTokenUtils, InvalidCredentialsError, IUser, UserRepository } from "../index.js";
import { compare } from "bcrypt";

interface Request {
    email: string;
    password: string;
}
interface Response {
    _id: unknown;
    email: string;
    firstName: string;
    lastName: string;
    role: string[];
    token: string;
}

export class AuthenticationService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(data: Request): Promise<Response> {
        const user: IUser | null = await this.userRepository.findByEmail(data.email);

        if (!user || user.deleted === true) {
            throw new InvalidCredentialsError();
        }

        const IsValidePassword = compare(data.password, user.password);

        if (!IsValidePassword) {
            throw new InvalidCredentialsError();
        }

        return {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            token: GenerateTokenUtils.execute(user),
        };
    }
}
