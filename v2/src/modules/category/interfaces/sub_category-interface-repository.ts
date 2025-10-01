import { ISub_category, IUpadteSub_category } from "../index.js";

export interface Sub_categoryRepository {
    // ========= Sub_category ===========

    createSub_categories(sub_categoryName: string, subCategoryID: string): Promise<ISub_category>;
    findSub_categoryByName(sub_categoryName: string): Promise<ISub_category | null>;
    findSub_categoryById(sub_categoryId: string): Promise<ISub_category | null>;
    fetchSub_categoriesBySubCategory(subCategoryId: string): Promise<ISub_category[] | []>;
    updateSub_category(input: IUpadteSub_category): Promise<ISub_category | null>;
    addProductToSub_category(categoryId: string, productId: string | string[]): Promise<ISub_category | null>;
}
