import { CategoryModel, CategoryRepository, ICategory, IUpdateCategory } from "../index.js";

export class MongooseCategoryRepository implements CategoryRepository {
    // ========= Category ===========

    async createCategory(categoryName: string): Promise<ICategory> {
        const category = await CategoryModel.create({
            categoryName,
            code: categoryName.toLowerCase().replace(/\s/g, ""),
        });

        return category;
    }

    async findCategoryByName(categoryName: string): Promise<ICategory | null> {
        const category = await CategoryModel.findOne({ categoryName: categoryName }).populate("subCategories");
        return category;
    }

    async findCategoryById(categoryId: string): Promise<ICategory | null> {
        const category = await CategoryModel.findById(categoryId);
        return category;
    }

    async updateCategory({ categoryId, categoryName, availability }: IUpdateCategory): Promise<ICategory | null> {
        const update: Partial<ICategory> = {};

        if (categoryName) {
            update.categoryName = categoryName;
            update.code = categoryName.toLowerCase().replace(/\s/g, "");
        }
        if (availability !== undefined) update.availability = availability;

        const categoryUpdate = await CategoryModel.findByIdAndUpdate(categoryId, { $set: update }, { new: true, runValidators: true });

        return categoryUpdate;
    }

    async addProductToCategory(categoryId: string, productId: string | string[]): Promise<ICategory | null> {
        const category = await CategoryModel.findByIdAndUpdate(
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

        return category;
    }

    async getAvaliableCategories(): Promise<ICategory[]> {
        const categories = await CategoryModel.find({ availability: true }).populate({
            path: "subCategories",
            populate: {
                path: "sub_categories",
            },
        });


        

        return categories;
    }

    
}
