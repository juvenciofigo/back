import { genSaltSync, hashSync } from "bcrypt";
import { GenerateTokenUtils, UpdateUserInput, UserRepository } from "../index.js";

export class UpdateUserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute({ userId, firstName, lastName, email, password }: UpdateUserInput): Promise<unknown> {
        const updatedUser = await this.userRepository.updateUser({
            userId,
            firstName,
            lastName,
            email,
            password: hashSync(password, genSaltSync(10)),
        });

        if (!updatedUser) {
            throw new Error("User not found");
        }


        return {
            ...updatedUser,
            token: GenerateTokenUtils.execute(updatedUser),
        };
    }
}
