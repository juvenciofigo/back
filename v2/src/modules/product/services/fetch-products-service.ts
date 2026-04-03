import { GetCategoryService, GetSubCategoryService, GetSub_categoryService, IProduct, ProductRepository } from "../index.js";
import { Request } from "express-jwt";
import mongoosePaginate from "mongoose-paginate-v2";

export class FetchProductsService {
    private productRepository: ProductRepository;
    private getCategoryService: GetCategoryService;
    private getSubCategoryService: GetSubCategoryService;
    private getSub_categoryService: GetSub_categoryService;

    constructor(
        productRepository: ProductRepository,
        getCategoryService: GetCategoryService,
        getSubCategoryService: GetSubCategoryService,
        getSub_categoryService: GetSub_categoryService
    ) {
        this.productRepository = productRepository;
        this.getCategoryService = getCategoryService;
        this.getSubCategoryService = getSubCategoryService;
        this.getSub_categoryService = getSub_categoryService;
    }

    async execute(req: Request) {
        const query: any = { productAvailability: true };
        const category = req.query?.category as string;
        const subcategory = req.query?.subcategory as string;
        const sub_category = req.query?.sub_category as string;

        const options = {
            page: Number(req.query?.page) || 1,
            limit: Number(req.query?.limit) || 10,
            sort: { createdAt: -1 },
            select: "-productVendor -order_items -timesPurchased -totalRevenue -sales -acquisitionCost -additionalCosts",
        };

        if (category) {
            const categoryData = await this.getCategoryService.execute(category);
            query.productCategory = categoryData._id;
        }

        if (subcategory) {
            const subcategoryData = await this.getSubCategoryService.execute(subcategory);
            query.productSubcategory = subcategoryData._id;
        }

        if (sub_category) {
            const sub_categoryData = await this.getSub_categoryService.execute(sub_category);
            query.productSub_category = sub_categoryData._id;
        }

        const products = await this.productRepository.fetchProducts(query, options);

        return products;
    }
}
