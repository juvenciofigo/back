import { ResponsePaginate } from "src/shared/interface.js";
import { ICreateProduct, IProduct, IProductUpdate, IProductRepository, ProductsModel, ViewsProductsModel } from "../index.js";

export class MongooseProductRepository implements IProductRepository {
    async createProduct(data: ICreateProduct): Promise<IProduct> {
        const product = new ProductsModel({ ...data });
        await product.save();
        return product;
    }

    async updateProduct(query: any, data: Partial<IProductUpdate>): Promise<IProduct | null> {
        const updateProduct = await ProductsModel.findByIdAndUpdate(query, data, { new: true });

        return updateProduct;
    }

    async getProduct(query: any): Promise<IProduct | null> {
        return await ProductsModel
            .findOne(query)
            .populate("productCategory productSubcategory productSub_category productBrand");
    }

    async fetchProducts(query: any, options: any): Promise<ResponsePaginate<IProduct>> {
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

    async updateProductVariation(productId: string, variationId: string): Promise<IProduct | null> {

        return await ProductsModel.findByIdAndUpdate(
            productId,
            {
                $addToSet: {
                    productVariations: variationId
                }
            },
            { new: true }
        );;
    }
}
