import { ResponsePaginate } from "src/shared/interface.js";
import { ICategory } from "../../index.js";

export interface ICategoryRepository {
    // Admin
    createCategory(categoryName: string): Promise<ICategory | null>;
    updateCategory(categoryId: string, update: Partial<ICategory>): Promise<ICategory | null>;
    deleteCategory(categoryId: string): Promise<boolean>;
    addProductToCategory(categoryId: string, productId: string | string[]): Promise<ICategory | null>;
    addSubCategoryToCategory(categoryId: string, subCategoryId: string | string[]): Promise<ICategory | null>

    // Public
    fetchCategories(query: any, options: any): Promise<ResponsePaginate<ICategory>>;
    getCategory(query: any): Promise<ICategory | null>;
}
