import { ResponsePaginate } from "src/shared/interface.js";
import { ISubCategoryRepository, ISubCategory, CategoryModel, SubCategoryModel, IUpdateSubCategory } from "../../index.js";

export class MongooseSubCategoryRepository implements ISubCategoryRepository {
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

    async getSubCategory(query: any): Promise<ISubCategory | null> {
        return await SubCategoryModel
            .findOne(query)
            .populate("products sub_categories");

    }

    async fetchSubcategories(query: any, options: any): Promise<ResponsePaginate<ISubCategory>> {
        const subCategories = await SubCategoryModel
            .paginate(query, options);

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

    async deleteSubCategory(subCategoryId: string): Promise<boolean> {
        const deleted = await SubCategoryModel.findByIdAndDelete(subCategoryId);
        return !!deleted;
    }

    async addSub_CategoryToSubCategory(subCategoryId: string, sub_categoryId: string | string[]): Promise<void> {
        await SubCategoryModel.findByIdAndUpdate(
            subCategoryId,
            {
                $addToSet: {
                    sub_categories: {
                        $each: Array.isArray(sub_categoryId) ? sub_categoryId : [sub_categoryId],
                    },
                },
            },
            { new: true }
        );

    }
}

