import status from "http-status";
import { BaseError, BrandRepository, IBrand, ICreateBrand } from "../index.js";
interface Request {
    data: ICreateBrand;
}
export class CreateBrandService {
    private brandReposiory: BrandRepository;

    constructor(brandReposiory: BrandRepository) {
        this.brandReposiory = brandReposiory;
    }

    async execute({ data }: Request): Promise<IBrand | null> {
        const existsBrand = await this.brandReposiory.fetchBrandsByName(data.name);

        if (existsBrand) {
            throw new BaseError("Brand Name Already Exists", status.CONFLICT);
        }
        const brand = await this.brandReposiory.createBrand(data);

        return brand;
    }
}
