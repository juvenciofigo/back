import { ResponsePaginate } from "src/shared/interface.js";
import { GetCategoryService, GetSubCategoryService, GetSub_categoryService, IProduct, IProductRepository } from "../index.js";
import { Request } from "express-jwt";

export class FetchProductsAdminService {
    constructor(
        private productRepository: IProductRepository,
        private getCategoryService: GetCategoryService,
        private getSubCategoryService: GetSubCategoryService,
        private getSub_categoryService: GetSub_categoryService
    ) { }

    async execute(req: Request): Promise<ResponsePaginate<IProduct>> {
        const {
            categoryId,
            subcategoryId,
            sub_categoryId,
            brandId,
            minPrice,
            maxPrice,
            availability,
            search,
            sort,
            page,
            limit
        } = req.query;

        const query: any = {};

        // Filtro de disponibilidade (Admin pode filtrar por ambos os estados)
        if (availability !== undefined) {
            query.productAvailability = availability === "true";
        }

        // 1. Filtros de Categorias (População de IDs)
        if (categoryId) {
            const categoryData = await this.getCategoryService.execute(categoryId as string);
            query.productCategory = categoryData._id;
        }

        if (subcategoryId) {
            const subcategoryData = await this.getSubCategoryService.execute(subcategoryId as string);
            query.productSubcategory = subcategoryData._id;
        }

        if (sub_categoryId) {
            const sub_categoryData = await this.getSub_categoryService.execute(sub_categoryId as string);
            query.productSub_category = sub_categoryData._id;
        }

        // 2. Filtro de Marca
        if (brandId) {
            query.productBrand = brandId;
        }

        // 3. Busca por Nome (Regex parcial e case-insensitive)
        if (search) {
            query.productName = { $regex: search, $options: "i" };
        }

        // 4. Filtro de Preço (Intervalo)
        if (minPrice || maxPrice) {
            query.productPrice = {};
            if (minPrice) query.productPrice.$gte = Number(minPrice);
            if (maxPrice) query.productPrice.$lte = Number(maxPrice);
        }

        // 5. Organização das Opções de Paginação e Ordenação
        const sortOptions: any = {};
        switch (sort) {
            case "price_asc":
                sortOptions.productPrice = 1;
                break;
            case "price_desc":
                sortOptions.productPrice = -1;
                break;
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
            limit: Number(limit) || 20, // Admin pode ver mais itens por página
            sort: sortOptions,
            populate: [
                { path: "productCategory", select: "categoryName" },
                { path: "productSubcategory", select: "subCategoryName" },
                { path: "productSub_category", select: "sub_categoryName" },
                { path: "productBrand", select: "name" }
            ],
            // Admin vê todos os campos (removido o select de exclusão)
        };

        return await this.productRepository.fetchProducts(query, options);
    }
}
