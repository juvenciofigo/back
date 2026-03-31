import { Document, Types } from "mongoose";
import { ISub_category } from "../../index.js";

// SubCategory
export interface ISubCategory extends Document {
    subCategoryName: string;
    code: string;
    category: Types.ObjectId;
    sub_categories: ISub_category[];
    availability: boolean;
    products: Types.ObjectId[];
}

export interface IUpdateSubCategory {
    subCategoryId: string;
    subCategoryName?: string;
    code?: string;
    categoryId?: string;
    sub_categories?: ISub_category[];
    availability?: boolean;
    products?: Types.ObjectId[];
}
