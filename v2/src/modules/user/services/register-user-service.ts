import { GenerateTokenUtils, UserAlreadyExistsError, UserRepository } from "../index.js";
import { hashSync, genSaltSync } from "bcrypt";

interface Request {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
interface Response {
    _id: unknown;
    email: string;
    firstName: string;
    lastName: string;
    role: string[];
    token: string;
}

export class RegisterUserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute({ email, password, firstName, lastName }: Request): Promise<Response> {
        // Verificar se o e-mail já está em uso em Users

        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            throw new UserAlreadyExistsError();
        }

        const passwordHash = hashSync(password, genSaltSync(10));

        const user = await this.userRepository.registerUser({ email, firstName, lastName, password: passwordHash });

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
