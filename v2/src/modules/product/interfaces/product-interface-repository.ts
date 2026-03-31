import { ICreateProduct, IProduct, IProductUpdate } from "../index.js";

export interface ProductRepository {
    createProduct(data: ICreateProduct): Promise<IProduct>;
    findProductBySku(sku: string): Promise<IProduct | null>;
    findProductById(productId: string): Promise<IProduct | null>;
    fetchProducts(query: any, options: any): Promise<any>;
    searchProducts(query: any, options: any): Promise<any>;
    updateProduct(productId: string, data: Partial<IProductUpdate>): Promise<IProduct | null>;
    trackProductView(productId: string, guestData: any): Promise<void>;
    getViewOnDay(productId: string): Promise<any>;
    updateViewOnDay(viewId: string, guestData: any): Promise<void>;
}
