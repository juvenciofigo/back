import { ResponsePaginate } from "src/shared/interface.js";
import { ISubCategory, ISubCategoryRepository } from "../../index.js";
import { Request } from "express-jwt";

export class FetchSubCategoriesAdminService {
    constructor(private subCategoryRepository: ISubCategoryRepository) { }

    async execute(req: Request): Promise<ResponsePaginate<ISubCategory>> {
        const {
            categoryId,
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

        // 1. Filtro por Categoria Pai (Nível 1)
        if (categoryId) {
            query.category = categoryId;
        }

        // 2. Busca por Nome (Regex parcial e case-insensitive)
        if (search) {
            query.subCategoryName = { $regex: search, $options: "i" };
        }

        // 3. Organização das Opções de Paginação e Ordenação
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
            populate: ["category", "sub_categories"],
        };

        return await this.subCategoryRepository.fetchSubcategories(query, options);
    }
}
