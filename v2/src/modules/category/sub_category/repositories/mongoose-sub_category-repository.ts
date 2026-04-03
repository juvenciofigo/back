import {  ISub_category, Sub_categoryModel} from "../../index.js";

export class MongooseSub_categoryRepository {

    async createSub_categories(data: Partial<ISub_category>): Promise<ISub_category> {
        return Sub_categoryModel.create(data);
    }

    async updateSub_category(
        subCategoryId: string,
        update: Partial<ISub_category>
    ): Promise<ISub_category | null> {

        return Sub_categoryModel.findByIdAndUpdate(
            subCategoryId,
            { $set: update },
            { new: true, runValidators: true }
        );
    }

    async deleteSub_category(subCategoryId: string): Promise<boolean> {
        const deleted = await Sub_categoryModel.findByIdAndDelete(subCategoryId);
        return Boolean(deleted);
    }

    async getSub_category(subCategoryId: string): Promise<ISub_category | null> {
        return Sub_categoryModel
            .findById(subCategoryId)
            .populate(["products", "subCategory"]);
    }

    async fetchSub_categories(options: Record<string, any> = {}): Promise<ISub_category[]> {
        return Sub_categoryModel
            .find(options)
            .populate(["products", "subCategory"]);
    }

    async findSub_categoryByName(sub_categoryName: string): Promise<ISub_category | null> {
        return Sub_categoryModel.findOne({ sub_categoryName: sub_categoryName });
    }

    async addProductToSub_category(
        subCategoryId: string,
        products: string[]
    ): Promise<ISub_category | null> {

        return Sub_categoryModel.findByIdAndUpdate(
            subCategoryId,
            {
                $addToSet: {
                    products: { $each: products },
                },
            },
            { new: true }
        );
    }
}