import { ICategory, IUpdateCategory } from "../../index.js";

export interface CategoryRepository {
    createCategory(categoryName: string): Promise<ICategory>;
    findCategoryByName(categoryName: string): Promise<ICategory | null>;
    findCategoryById(categoryId: string): Promise<ICategory | null>;
    updateCategory(input: IUpdateCategory): Promise<ICategory | null>;
    getAvaliableCategories(): Promise<ICategory[]>;
    addProductToCategory(categoryId: string, productId: string | string[]): Promise<ICategory | null>;
}
