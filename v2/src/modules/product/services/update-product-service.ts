import status from "http-status";
import {
    BaseError,
    BrandRepository,
    CategoryRepository,
    IProduct,
    IProductUpdate,
    ProductRepository,
    SubCategoryRepository,
    Sub_categoryRepository,
    uploadFirebase,
} from "../index.js";
interface Request {
    productId: string;
    userId: string;
    data: IProductUpdate;
    images: Express.Multer.File[];
}
export class UpdateProductService {
    private productRepository: ProductRepository;
    private categoryRepository: CategoryRepository;
    private subCategoryRepository: SubCategoryRepository;
    private sub_categoryRepository: Sub_categoryRepository;
    private brandReposiory: BrandRepository;

    constructor(
        productRepository: ProductRepository,
        categoryRepository: CategoryRepository,
        subCategoryRepository: SubCategoryRepository,
        sub_categoryRepository: Sub_categoryRepository,
        brandReposiory: BrandRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.subCategoryRepository = subCategoryRepository;
        this.sub_categoryRepository = sub_categoryRepository;
        this.brandReposiory = brandReposiory;
    }

    async execute({ data, images, userId, productId }: Request): Promise<IProduct | null> {
        const productToUpdate: Partial<IProduct> = {
            ...data,
            createBy: userId,
            productCategory: data.productCategory ? [...new Set(data.productCategory)] : [],
            productSubcategory: data.productSubcategory ? [...new Set(data.productSubcategory)] : [],
            productSub_category: data.productSub_category ? [...new Set(data.productSub_category)] : [],
        };

        const product = await this.productRepository.findProductById(productId);

        if (!product) {
            throw new BaseError("Product not found", status.NOT_FOUND);
        }

        if (data.sku) {
            const existingSku = await this.productRepository.findProductBySku(data.sku);
            if (existingSku) {
                throw new BaseError("Product not found", status.CONFLICT);
            }
        }

        const validCategories: string[] = [];
        if (productToUpdate.productCategory && productToUpdate.productCategory.length > 0) {
            for (const categoryId of productToUpdate.productCategory) {
                const category = await this.categoryRepository.addProductToCategory(categoryId, product.id);

                if (category) {
                    validCategories.push(categoryId);
                }
            }
        }

        const validSubcategories: string[] = [];
        if (productToUpdate.productSubcategory && productToUpdate.productSubcategory.length > 0) {
            for (const subCategoryId of productToUpdate.productSubcategory) {
                const subCategory = await this.subCategoryRepository.addProductToSubCategory(subCategoryId, product.id);

                if (subCategory) {
                    validSubcategories.push(subCategoryId);
                }
            }
        }

        const validSub_categories: string[] = [];
        if (productToUpdate.productSub_category && productToUpdate.productSub_category.length > 0) {
            for (const sub_categoryId of productToUpdate.productSub_category) {
                const sub_category = await this.sub_categoryRepository.addProductToSub_category(sub_categoryId, product.id);

                if (sub_category) {
                    validSub_categories.push(sub_categoryId);
                }
            }
        }

        let imageUrls: string[] = [];
        if (Array.isArray(images) && images.length > 0) {
            imageUrls = await uploadFirebase(images);
        }

        let brand: string = "";
        if (data.productBrand) {
            brand = await this.associateProductToBrand(data.productBrand, product.id);
        }

        const productCreated = await this.productRepository.updateProduct(product.id, {
            productImage: imageUrls,
            productSub_category: validSub_categories,
            productSubcategory: validSubcategories,
            productCategory: validCategories,
            productBrand: brand,
        });

        return productCreated;
    }

    private async associateProductToBrand(brandId: string, productId: string): Promise<string> {
        let products: string[] = [];
        const brandToUpdate = await this.brandReposiory.findBrandById(brandId);
        if (brandToUpdate && brandToUpdate.products) {
            products = [...new Set([...brandToUpdate.products, productId])];
        }
        const brand = await this.brandReposiory.updateBrand(brandId, { products });
        return brand ? brand.id : "";
    }
}
