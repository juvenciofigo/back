import { ISubCategory, IUpdateSubCategory } from "../../index.js";

export interface SubCategoryRepository {
    createSubCategory(subCategoryName: string, categoryId: string): Promise<ISubCategory>;
    updateSubCategory(input: IUpdateSubCategory): Promise<ISubCategory | null>;
    deleteSubCategory(subCategoryId: string): Promise<boolean>;
    findSubCategoryByName(subCategoryName: string): Promise<ISubCategory | null>;
    addProductToSubCategory(categoryId: string, productId: string | string[]): Promise<ISubCategory | null>;
    addSub_CategoryToSubCategory(subCategoryId: string, sub_categoryId: string | string[]): Promise<void>

    fetchSubcategories(options: any): Promise<ISubCategory[]>;
    getSubCategory(subCategoryId: string): Promise<ISubCategory | null>;
}
