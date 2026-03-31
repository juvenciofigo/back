import { ICreateProduct, IProduct, IProductUpdate, ProductRepository, ProductsModel, ViewsProductsModel } from "../index.js";

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

    async trackProductView(productId: string, guestData: any): Promise<void> {
        await ViewsProductsModel.create({
            product: productId,
            views: 1,
            guests: [guestData],
        });
    }

    async getViewOnDay(productId: string) {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const view = await ViewsProductsModel.findOne({
            product: productId,
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        });

        return view;
    }

    async updateViewOnDay(viewId: string, guestData: any): Promise<void> {
        await ViewsProductsModel.findByIdAndUpdate(viewId, {
            $inc: { views: 1 },
            $push: { guests: guestData },
        });
    }

    async updateProduct(productId: string, data: Partial<IProductUpdate>): Promise<IProduct | null> {
        const updateProduct = await ProductsModel.findByIdAndUpdate(productId, data, { new: true });

        return updateProduct;
    }
}
