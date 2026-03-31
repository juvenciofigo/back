import { Document, Types } from "mongoose";
import { ISub_category, ISubCategory } from "../../index.js";

// Category

export interface ICategory extends Document {
    categoryName: string;
    code: string;
    availability: boolean;
    subCategories: ISubCategory[];
    products: Types.ObjectId[];
}
export interface IUpdateCategory {
    categoryId: string;
    categoryName?: string;
    availability?: boolean;
    code?: string;
    products?: Types.ObjectId[];
    sub_categories?: ISub_category[];
}
