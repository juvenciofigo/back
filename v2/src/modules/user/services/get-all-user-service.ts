import { IUser, UserRepository } from "../index.js";
import { ResponsePaginate } from "../../../shared/interface.js";
import { convertResponse } from "../../../shared/utils/convertResponse.js";

export class GetAllUserService {
    private usersRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.usersRepository = userRepository;
    }

    async execute(page: number = 1, limit: number = 10): Promise<ResponsePaginate<IUser>> {
        const result = await this.usersRepository.getUsers(page, limit);

        return convertResponse(result);
    }
}
