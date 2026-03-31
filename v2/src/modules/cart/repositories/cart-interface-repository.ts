import { ICart } from "../index.js";

export interface CartRepository {
    create(userId: string): Promise<ICart>;
    getCarts(): Promise<ICart[]>;
    fetchCartByUser(userId: string): Promise<ICart | null>;
}
