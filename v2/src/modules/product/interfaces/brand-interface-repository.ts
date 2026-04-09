import { ResponsePaginate } from "src/shared/interface.js";
import { ICreateBrand, IBrand } from "../index.js";

export interface IBrandRepository {
    createBrand(input: ICreateBrand): Promise<IBrand>;
    findBrandById(brandId: string): Promise<IBrand | null>;
    fetchBrandsByName(brandName: string): Promise<IBrand | null>;
    fetchBrandsByProduct(productId: string): Promise<IBrand[] | [null]>;
    fetchBrands(query: any, options: any): Promise<ResponsePaginate<IBrand>>;
    updateBrand(brandId: string, input: Partial<IBrand>): Promise<IBrand | null>;
}
