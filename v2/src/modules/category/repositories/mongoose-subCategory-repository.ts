import { SubCategoryRepository, ISubCategory, CategoryModel, SubCategoryModel, IUpdateSubCategory } from "../index.js";

export class MongooseSubCategoryRepository implements SubCategoryRepository {
    // ========= SubCategory ===========

    async createSubCategory(subCategoryName: string, categoryId: string): Promise<ISubCategory> {
        const subCategory = await SubCategoryModel.create({ subCategoryName, category: categoryId, code: subCategoryName.toLowerCase().replace(/\s/g, "") });

        await CategoryModel.findByIdAndUpdate(categoryId, {
            $push: { subCategories: subCategory._id },
        });

        return subCategory;
    }

    async findSubCategoryByName(subCategoryName: string): Promise<ISubCategory | null> {
        const subCategory = await SubCategoryModel.findOne({ subCategoryName: subCategoryName });
        return subCategory;
    }

    async findSubCategoryById(subCategoryId: string): Promise<ISubCategory | null> {
        const subCategory = await SubCategoryModel.findById(subCategoryId).populate("products sub_categories");
        return subCategory;
    }

    async fetchSubcategoriesByCategory(subCategoryId: string): Promise<ISubCategory[] | null> {
        const subCategories = await SubCategoryModel.find({ category: subCategoryId }).populate({ path: "products sub_categories" });

        return subCategories;
    }

    async updateSubCategory({ subCategoryName, subCategoryId, availability }: IUpdateSubCategory): Promise<ISubCategory | null> {
        const update: Partial<ISubCategory> = {};

        if (subCategoryName) {
            update.subCategoryName = subCategoryName;
            update.code = subCategoryName.toLowerCase().replace(/\s/g, "");
        }
        if (typeof availability === "boolean") update.availability = availability;

        const subCategoryUpdate = await SubCategoryModel.findByIdAndUpdate(subCategoryId, { $set: update }, { new: true, runValidators: true });

        return subCategoryUpdate;
    }

    async addProductToSubCategory(subCategoryId: string, productId: string | string[]): Promise<ISubCategory | null> {
        const subCategory = await SubCategoryModel.findByIdAndUpdate(
            subCategoryId,
            {
                $addToSet: {
                    products: {
                        $each: Array.isArray(productId) ? productId : [productId],
                    },
                },
            },
            { new: true }
        );

        return subCategory;
    }
}
