import { ResponsePaginate } from "src/shared/interface.js";
import { CategoryModel, ICategoryRepository, ICategory } from "../../index.js";

export class MongooseCategoryRepository implements ICategoryRepository {
    // ========= Category ===========

    async createCategory(categoryName: string): Promise<ICategory | null> {
        return await CategoryModel.create({
            categoryName,
            code: categoryName.toLowerCase().replace(/\s/g, ""),
        });
    }

    async updateCategory(categoryId: string, update: Partial<ICategory>): Promise<ICategory | null> {

        return await CategoryModel.findByIdAndUpdate(
            categoryId,
            { $set: update },
            {
                new: true,
                runValidators: true
            }
        );

    }

    async deleteCategory(categoryId: string): Promise<boolean> {
        const deleted: ICategory | null = await CategoryModel.findByIdAndDelete(categoryId);
        return !!deleted;
    }

    async addProductToCategory(categoryId: string, productId: string | string[]): Promise<ICategory | null> {
        return await CategoryModel.findByIdAndUpdate(
            categoryId,
            {
                $addToSet: {
                    products: {
                        $each: Array.isArray(productId) ? productId : [productId],
                    },
                },
            },
            { new: true }
        );
    }

    async addSubCategoryToCategory(categoryId: string, subCategoryId: string | string[]): Promise<ICategory | null> {
        return await CategoryModel.findByIdAndUpdate(
            categoryId,
            {
                $addToSet: {
                    subCategories: {
                        $each: Array.isArray(subCategoryId) ? subCategoryId : [subCategoryId],
                    },
                },
            },
            { new: true }
        );

    }

    // Public

    async fetchCategories(query: any = {}, options: any = {}): Promise<ResponsePaginate<ICategory>> {
        return await CategoryModel
            .paginate(query, options);

    }

    async getCategory(query: any): Promise<ICategory | null> {
        return await CategoryModel
            .findOne(query)
            .populate(
                {
                    path: "subCategories",
                    populate: {
                        path: "sub_categories",
                    }
                }
            );
    }
}
