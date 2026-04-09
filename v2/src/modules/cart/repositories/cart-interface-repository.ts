import { ICart } from "../index.js";
import { IQueryOptions, ResponsePaginate } from "src/shared/interface.js";

export interface ICartRepository {
    getCart(query: any): Promise<ICart | null>;
    create(userId: string): Promise<ICart>;
    fetchCarts(query: any, options: any): Promise<ResponsePaginate<ICart>>;
    fetchCartByUser(userId: string): Promise<ICart | null>;
}
