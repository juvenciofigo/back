import { SubCategoryModel, ISub_category, Sub_categoryModel, Sub_categoryRepository, IUpadteSub_category } from "../index.js";

export class MongooseSub_categoryRepository implements Sub_categoryRepository {
    // ========= Sub_category ===========

    async createSub_categories(sub_categoryName: string, subCategoryID: string): Promise<ISub_category> {
        const sub_category = await Sub_categoryModel.create({
            sub_categoryName,
            subCategory: subCategoryID,
            code: sub_categoryName.toLowerCase().replace(/\s/g, ""),
        });

        await SubCategoryModel.findByIdAndUpdate(subCategoryID, {
            $addToSet: { sub_categories: sub_category._id },
        });
        return sub_category;
    }
    async findSub_categoryById(sub_categoryId: string): Promise<ISub_category | null> {
        const sub_category = await Sub_categoryModel.findById(sub_categoryId).populate("products subCategory");
        return sub_category;
    }

    async findSub_categoryByName(sub_categoryName: string): Promise<ISub_category | null> {
        const subCategory = await Sub_categoryModel.findOne({ sub_categoryName: sub_categoryName });
        return subCategory;
    }

    async fetchSub_categoriesBySubCategory(subCategoryId: string): Promise<ISub_category[] | []> {
        const sub_categories = await Sub_categoryModel.find({ subCategory: subCategoryId }).populate("products subCategory");
        return sub_categories;
    }

    async updateSub_category({ sub_categoryId, availability, sub_categoryName }: IUpadteSub_category): Promise<ISub_category | null> {
        const update: Partial<ISub_category> = {};

        if (sub_categoryName) {
            update.sub_categoryName = sub_categoryName;
            update.code = sub_categoryName.toLowerCase().replace(/\s/g, "");
        }
        if (typeof availability === "boolean") update.availability = availability;

        const subCategoryUpdate = await Sub_categoryModel.findByIdAndUpdate(sub_categoryId, { $set: update }, { new: true, runValidators: true });

        return subCategoryUpdate;
    }

    async addProductToSub_category(sub_categoryId: string, productId: string | string[]): Promise<ISub_category | null> {
        const sub_category = await Sub_categoryModel.findByIdAndUpdate(
            sub_categoryId,
            {
                $addToSet: {
                    products: {
                        $each: Array.isArray(productId) ? productId : [productId],
                    },
                },
            },
            { new: true }
        );

        return sub_category;
    }
}
