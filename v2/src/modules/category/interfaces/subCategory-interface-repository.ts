import { ISubCategory, IUpdateSubCategory } from "../index.js";

export interface SubCategoryRepository {
    // ========= SubCategory ===========

    createSubCategory(subCategoryName: string, categoryId: string): Promise<ISubCategory>;
    findSubCategoryByName(subCategoryName: string): Promise<ISubCategory | null>;
    findSubCategoryById(subCategoryId: string): Promise<ISubCategory | null>;
    fetchSubcategoriesByCategory(subCategoryId: string): Promise<ISubCategory[] | null>;
    updateSubCategory(input: IUpdateSubCategory): Promise<ISubCategory | null>;
}
