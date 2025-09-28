import { Document, Types } from "mongoose";

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

// Sub_category

export interface ISub_category extends Document {
    sub_categoryName: string;
    code: string;
    availability: boolean;
    subCategory: Types.ObjectId;
    products: Types.ObjectId[];
}
export interface IUpadteSub_category {
    sub_categoryId: string;
    sub_categoryName?: string;
    code?: string;
    availability?: boolean;
    subCategory?: Types.ObjectId;
    products?: Types.ObjectId[];
}
