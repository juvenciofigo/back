import { ResponsePaginate } from "src/shared/interface.js";
import { ICartRepository, ICart } from "../index.js";
import { Request } from "express-jwt";

export class FetchCartsService {
    constructor(private cartRepository: ICartRepository) { }

    async execute(req: Request): Promise<ResponsePaginate<ICart>> {
        const {
            sort,
            page,
            limit
        } = req.query;

        const query: any = {};

        // 1. Organização das Opções de Paginação e Ordenação
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
            limit: Number(limit) || 10,
            sort: sortOptions,
            populate: [
                { path: "cartUser", select: "firstName lastName email" },
                { 
                    path: "cartItens.productId", 
                    select: "productName productImage productPrice" 
                }
            ],
        };

        return await this.cartRepository.fetchCarts(query, options);
    }
}
