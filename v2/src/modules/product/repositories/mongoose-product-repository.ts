import { ICreateProduct, IProduct, IProductUpdate, ProductRepository, ProductsModel } from "../index.js";

export class MongooseProductRepository implements ProductRepository {
    async createProduct(data: ICreateProduct): Promise<IProduct> {
        const product = new ProductsModel({ ...data });
        await product.save();
        return product;
    }

    async findProductById(productId: string): Promise<IProduct | null> {
        const product = await ProductsModel.findById(productId).populate("productCategory productSubcategory productSub_category productBrand");
        return product;
    }

    async findProductBySku(sku: string): Promise<IProduct | null> {
        const product = await ProductsModel.findOne({ sku: sku });
        return product;
    }

    async fetchProducts(query: any, options: any): Promise<any> {
        const products = await ProductsModel.paginate(query, options);
        return products;
    }

    async searchProducts(query: any, options: any): Promise<any> {
        const products = await ProductsModel.paginate(query, options);
        return products;
    }

    async updateProduct(productId: string, data: Partial<IProductUpdate>): Promise<IProduct | null> {
        const updateProduct = await ProductsModel.findByIdAndUpdate(productId, data, { new: true });

        return updateProduct;
    }
}
