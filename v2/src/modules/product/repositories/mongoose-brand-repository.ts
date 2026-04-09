import { ResponsePaginate } from "src/shared/interface.js";
import { IBrand, IBrandRepository, ICreateBrand, BrandsModel } from "../index.js";

export class MongooseBrandRepository implements IBrandRepository {
    async createBrand(input: ICreateBrand): Promise<IBrand> {
        const brand = await BrandsModel.create(input);
        return brand;
    }
    async findBrandById(brandId: string): Promise<IBrand | null> {
        const brand = await BrandsModel.findById(brandId);

        return brand;
    }
    async fetchBrandsByProduct(productId: string): Promise<IBrand[] | [null]> {
        const brands = await BrandsModel.find({
            products: productId,
        }).populate("products");
        return brands;
    }
    async fetchBrands(query: any, options: any): Promise<ResponsePaginate<IBrand>> {
        const brands = await BrandsModel.paginate(query, options);
        return brands;
    }
    async updateBrand(brandId: string, input: Partial<IBrand>): Promise<IBrand | null> {
        const brand = await BrandsModel.findByIdAndUpdate(brandId, { input });
        return brand;
    }

    async fetchBrandsByName(brandName: string): Promise<IBrand | null> {
        const brand = await BrandsModel.findOne({ name: brandName });
        return brand;
    }
}
