import { Document, Types } from "mongoose";

// Sub_category
export interface ISub_category extends Document {
    sub_categoryName: string;
    code: string;
    availability: boolean;
    subCategory: Types.ObjectId;
    products: Types.ObjectId[];
}
export interface IUpdateSub_category {
    sub_categoryId: string;
    sub_categoryName?: string;
    code?: string;
    availability?: boolean;
    subCategory?: Types.ObjectId;
    products?: Types.ObjectId[];
}
