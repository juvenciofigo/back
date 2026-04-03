import { ISub_category, IUpdateSub_category } from "../../index.js";

export interface Sub_categoryRepository {
    createSub_categories(data: Partial<ISub_category>): Promise<ISub_category>;
    updateSub_category(sub_categoryId: string, update: Partial<ISub_category>): Promise<ISub_category | null>;
    deleteSub_category(sub_categoryId: string): Promise<boolean>;
    findSub_categoryByName(sub_categoryName: string): Promise<ISub_category | null>;
    addProductToSub_category(sub_categoryId: string, productId: string | string[]): Promise<ISub_category | null>;

    getSub_category(sub_categoryId: string): Promise<ISub_category | null>;
    fetchSub_categories(options: Record<string, any>): Promise<ISub_category[]>;
}
