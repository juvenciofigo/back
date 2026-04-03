import { ICategory } from "../../index.js";

export interface CategoryRepository {
    // Admin
    createCategory(categoryName: string): Promise<ICategory>;
    updateCategory(categoryId: string, update: Partial<ICategory>): Promise<ICategory | null>;
    deleteCategory(categoryId: string): Promise<boolean>;
    addProductToCategory(categoryId: string, productId: string | string[]): Promise<ICategory | null>;
    addSubCategoryToCategory(categoryId: string, subCategoryId: string | string[]): Promise<ICategory | null>

    // Public
    findCategoryByName(categoryName: string): Promise<ICategory | null>;
    fetchCategories(options: any): Promise<ICategory[]>;
    getCategory(categoryId: string): Promise<ICategory | null>;
}
