import { ResponsePaginate } from "src/shared/interface.js";
import { ISubCategory, IUpdateSubCategory } from "../../index.js";

export interface ISubCategoryRepository {
    createSubCategory(subCategoryName: string, categoryId: string): Promise<ISubCategory>;
    updateSubCategory(input: IUpdateSubCategory): Promise<ISubCategory | null>;
    deleteSubCategory(subCategoryId: string): Promise<boolean>;
    findSubCategoryByName(subCategoryName: string): Promise<ISubCategory | null>;
    addProductToSubCategory(categoryId: string, productId: string | string[]): Promise<ISubCategory | null>;
    addSub_CategoryToSubCategory(subCategoryId: string, sub_categoryId: string | string[]): Promise<void>

    fetchSubcategories(query: any, options: any): Promise<ResponsePaginate<ISubCategory>>;
    getSubCategory(query: any): Promise<ISubCategory | null>;
}
