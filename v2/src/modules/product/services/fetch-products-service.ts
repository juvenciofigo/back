import { IProduct, ProductRepository } from "../index.js";
import { Request } from "express-jwt";
import mongoosePaginate from "mongoose-paginate-v2";

export class FetchProductsService {
    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    async execute(req: Request) {
        const query: Record<string, any> = { productAvailability: true };

        const options = {
            page: Number(req.query?.page) || 1,
            limit: Number(req.query?.limit) || 30,
            select: "-productVendor -order_items -timesPurchased -totalRevenue -sales -acquisitionCost -additionalCosts",
        };

        if (req.query?.category) {
            query.productCategory = req.query.category;
        }
        if (req.query?.subcategory) {
            query.productSubcategory = req.query.subcategory;
        }
        if (req.query?.sub_category) {
            query.productSub_category = req.query.sub_category;
        }

        const products = await this.productRepository.fetchProducts(query, options);

        return products;
    }
}
