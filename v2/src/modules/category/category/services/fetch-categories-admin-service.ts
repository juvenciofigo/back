import { ResponsePaginate } from "src/shared/interface.js";
import { ICategoryRepository, ICategory } from "../../index.js";
import { Request } from "express-jwt";

export class FetchCategoriesAdminService {
    constructor(private categoryRepository: ICategoryRepository) { }

    async execute(req: Request): Promise<ResponsePaginate<ICategory>> {
        const {
            search,
            availability,
            sort,
            page,
            limit,
            all
        } = req.query;

        const query: any = {};

        // Filtro por Disponibilidade (Admin pode alternar)
        if (availability !== undefined) {
            query.availability = availability === "true";
        }

        // 1. Busca por Nome (Regex parcial e case-insensitive)
        if (search) {
            query.categoryName = { $regex: search, $options: "i" };
        }

        // 2. Organização das Opções de Paginação e Ordenação
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

        const options: any = {
            page: Number(page) || 1,
            limit: Number(limit) || 20,
            sort: sortOptions,
            pagination: all !== "true",
            populate: [
                {
                    path: "subCategories",
                    populate: {
                        path: "sub_categories",
                    }
                }
            ],
        };

        return await this.categoryRepository.fetchCategories(query, options);
    }
}
