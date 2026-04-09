import { ResponsePaginate } from "src/shared/interface.js";
import { ICreateProduct, IProduct, IProductUpdate } from "../index.js";

export interface IProductRepository {
    createProduct(data: ICreateProduct): Promise<IProduct>;
    updateProduct(query: any, data: Partial<IProductUpdate>): Promise<IProduct | null>;
    getProduct(query: any): Promise<IProduct | null>;
    fetchProducts(query: any, options: any): Promise<ResponsePaginate<IProduct>>;

    updateProductVariation(query: any, variationId: string): Promise<IProduct | null>;
    trackProductView(productId: string, guestData: any): Promise<void>;
    getViewOnDay(productId: string): Promise<any>;
    updateViewOnDay(viewId: string, guestData: any): Promise<void>;
}
