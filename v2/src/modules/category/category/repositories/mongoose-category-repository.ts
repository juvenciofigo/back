import { CategoryModel, CategoryRepository, ICategory } from "../../index.js";

export class MongooseCategoryRepository implements CategoryRepository {
    // ========= Category ===========

    async createCategory(categoryName: string): Promise<ICategory> {
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
        const deleted = await CategoryModel.findByIdAndDelete(categoryId);
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

    async findCategoryByName(categoryName: string): Promise<ICategory | null> {
        return await CategoryModel
            .findOne(
                { categoryName: categoryName })
            .populate("subCategories");
    }

    async fetchCategories(options: any = {}): Promise<ICategory[]> {
        return await CategoryModel.find(options).populate({
            path: "subCategories",
        });

    }

    async getCategory(categoryId: string): Promise<ICategory | null> {
        return await CategoryModel
            .findById(categoryId)
            .populate(
                {
                    path: "subCategories",
                }
            );
    }
}
