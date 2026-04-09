import { ISub_categoryRepository } from "../../index.js";
import { Request } from "express";

export class FetchSub_categoriesService {
    private sub_categoryRepository: ISub_categoryRepository;

    constructor(sub_categoryRepository: ISub_categoryRepository) {
        this.sub_categoryRepository = sub_categoryRepository;
    }

    async execute(req: Request) {
        const {
            subCategoryId,
            search,
            sort,
            page,
            limit,
            all
        } = req.query;

        const query: any = { availability: true };

        // 1. Filtro por Categoria Pai (Nível 2)
        if (subCategoryId) {
            query.subCategory = subCategoryId;
        }

        // 2. Busca por Nome (Regex parcial e case-insensitive)
        if (search) {
            query.sub_categoryName = { $regex: search, $options: "i" };
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
            limit: Number(limit) || 10,
            sort: sortOptions,
            pagination: all !== "true",
            populate: ["subCategory"],
        };

        return await this.sub_categoryRepository.fetchSub_categories(query, options);
    }
}
