import { ICreateBrand, IBrand } from "../index.js";

export interface BrandRepository {
    createBrand(input: ICreateBrand): Promise<IBrand>;
    findBrandById(brandId: string): Promise<IBrand | null>;
    fetchBrandsByName(brandName: string): Promise<IBrand | null>;
    fetchBrandsByProduct(productId: string): Promise<IBrand[] | [null]>;
    fetchBrands(): Promise<IBrand[] | []>;
    updateBrand(brandId: string, input: Partial<IBrand>): Promise<IBrand | null>;
}
