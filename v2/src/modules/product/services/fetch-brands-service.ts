import { IBrand, BrandRepository } from "../index.js";

export class FetchBrandsService {
    private brandRepository: BrandRepository;

    constructor(brandRepository: BrandRepository) {
        this.brandRepository = brandRepository;
    }

    async execute(): Promise<IBrand[] | []> {
        const brands = await this.brandRepository.fetchBrands();

        return brands;
    }
}
