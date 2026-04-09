import { IProductRepository } from "../index.js";

interface Request {
    search: string;
    page: number;
    limit: number;
}

export class SearchProductsService {
    private productRepository: IProductRepository;

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    async execute({ search, page, limit }: Request) {
        if (!search || search.trim() === "") {
            return { docs: [], totalDocs: 0, page: 1, totalPages: 0 };
        }

        const query = {
            productAvailability: true,
            $or: [
                { productName: { $regex: search, $options: "i" } },
                { productDescription: { $regex: search, $options: "i" } },
                { sku: { $regex: search, $options: "i" } },
                { productModel: { $regex: search, $options: "i" } },
            ],
        };

        const options = {
            page,
            limit,
            select: "-productVendor -order_items -timesPurchased -totalRevenue -sales -acquisitionCost -additionalCosts",
            populate: "productCategory productBrand",
        };

        const results = await this.productRepository.fetchProducts(query, options);

        return results;
    }
}
