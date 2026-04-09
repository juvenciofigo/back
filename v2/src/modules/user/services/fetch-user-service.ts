import { Request } from "express";
import { IUser, IUserRepository } from "../index.js";
import { ResponsePaginate } from "../../../shared/interface.js";

export class FetchUsersService {
    constructor(private usersRepository: IUserRepository) { }

    async execute(req: Request): Promise<ResponsePaginate<IUser>> {
        const {
            search,
            role,
            status,
            sort,
            page,
            limit
        } = req.query;

        const query: any = { deleted: false };

        // 1. Filtro por Cargo
        if (role) {
            query.role = role;
        }

        // 2. Filtro por Estado (Admin pode ver usuários deletados se passar status=deleted)
        if (status === "deleted") {
            query.deleted = true;
        }

        // 3. Busca por Nome ou Email (Regex parcial e case-insensitive)
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        // 4. Organização das Opções de Paginação e Ordenação
        const sortOptions: any = {};
        switch (sort) {
            case "oldest":
                sortOptions.createdAt = 1;
                break;
            case "newest":
            default:
                sortOptions.createdAt = -1;
                break;
        }

        const options = {
            page: Number(page) || 1,
            limit: Number(limit) || 20,
            sort: sortOptions,
            populate: ["customer"]
        };

        return await this.usersRepository.getUsers(query, options);
    }
}
