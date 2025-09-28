import { ICategory, IUpdateCategory } from "../index.js";

export interface CategoryRepository {
    // ========= Category ===========

    createCategory(categoryName: string): Promise<ICategory>;
    findCategoryByName(categoryName: string): Promise<ICategory | null>;
    findCategoryById(categoryId: string): Promise<ICategory | null>;
    updateCategory(input: IUpdateCategory): Promise<ICategory | null>;
    getAvaliableCategories(): Promise<ICategory[]>;
}
