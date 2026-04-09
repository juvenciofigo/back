import { IUser, UserNotFoundError, IUserRepository } from "../index.js";

interface IGetUserRequest {
    userId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    customer?: string;
    cart?: string;
    deleted?: boolean;
}

export class GetUserService {
    private usersRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.usersRepository = userRepository;
    }

    async execute(req: IGetUserRequest): Promise<IUser | null> {
        const query: any = {};

        if (req.userId) query._id = req.userId;
        if (req.email) query.email = req.email.trim().toLowerCase();
        if (req.firstName) query.firstName = req.firstName;
        if (req.lastName) query.lastName = req.lastName;
        if (req.customer) query.customer = req.customer;
        if (req.cart) query.cart = req.cart;

        // Evitar que uma pesquisa sem parâmetros traga um dado aleatório do banco de dados
        if (Object.keys(query).length === 0) {
            throw new Error("Pelo menos um parâmetro de busca (userId, email, etc) deve ser fornecido.");
        }

        // Caso o req.deleted seja passado explicitamente, respeita a escolha do req, caso contrário procura apenas não-deletados
        query.deleted = req.deleted !== undefined ? req.deleted : false;

        const user = await this.usersRepository.getUser(query);

        if (!user) {
            throw new UserNotFoundError();
        }

        return user;
    }
}
