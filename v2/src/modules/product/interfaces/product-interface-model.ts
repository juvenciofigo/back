import { Document, Types } from "mongoose";

// Subdocumentos
export interface ISale {
    quantity: number;
    date?: Date;
    customer: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IProfit {
    acquisitionCost: number;
    additionalCosts?: number;
    profitMargin?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IDeliveryEstimate {
    additionalCost: number;
    estimatedTime: "IMMEDIATE" | "7_DAYS" | "30_DAYS";
}

// Schemas principais
export interface IProduct extends Document {
    createBy: string;
    productName: string;
    productDescription: string;
    productSpecifications: string;
    productAvailability?: boolean;
    productPrice: number;
    productStock: boolean;
    productImage?: string[];
    productCategory?: string[];
    productSubcategory?: string[];
    productSub_category?: string[];
    productRatings?: string[];
    productVariations?: string[];
    productPromotion?: number;
    sku: string;
    productVendor: string;
    productModel?: string;
    productBrand?: string;
    productWeight?: number;
    productLength?: number;
    productWidth?: number;
    productHeight?: number;
    order_items?: string[];
    timesPurchased?: number;
    totalRevenue?: number;
    deliveryEstimate?: string[];
    sales?: ISale[];
    profit?: IProfit[];
    createdAt: Date;
    updatedAt?: Date;
}

export interface IProductUpdate {
    createBy: string;
    productName?: string;
    productDescription?: string;
    productSpecifications?: string;
    productAvailability?: boolean;
    productPrice?: number;
    productStock?: boolean;
    productImage?: string[];
    productCategory?: string[];
    productSubcategory?: string[];
    productSub_category?: string[];
    productRatings?: string[];
    productVariations?: string[];
    productPromotion?: number;
    sku?: string;
    productVendor?: string;
    productModel?: string;
    productBrand?: string;
    productWeight?: number;
    productLength?: number;
    productWidth?: number;
    productHeight?: number;
    order_items?: string[];
    timesPurchased?: number;
    totalRevenue?: number;
    deliveryEstimate?: string[];
    sales?: ISale[];
    profit?: IProfit[];
    createdAt: Date;
    updatedAt?: Date;
}

export interface ICreateProduct {
    createBy: string;
    productName: string;
    productDescription: string;
    productSpecifications: string;
    productAvailability: boolean;
    productPrice: number;
    productStock: boolean;
    productImage: string[];
    productCategory: string[];
    productSubcategory: string[];
    productSub_category: string[];
    productPromotion: number;
    productVendor: string;
    productModel: string;
    productBrand: string;
    productWeight: number;
    productLength: number;
    productWidth: number;
    productHeight: number;
    sku: string;
    deliveryEstimate: IDeliveryEstimate[];
}

export interface IProductUpdate {
    createby?: Types.ObjectId;
    productName?: string;
    productDescription?: string;
    productSpecifications?: string;
    productAvailability?: boolean;
    productPrice?: number;
    productStock?: boolean;
    productImage?: string[];
    productCategory?: string[];
    productSubcategory?: string[];
    productSub_category?: string[];
    productRatings?: string[];
    productVariations?: string[];
    productPromotion?: number;
    sku?: string;
    productVendor?: string;
    productModel?: string;
    productBrand?: string;
    productWeight?: number;
    productLength?: number;
    productWidth?: number;
    productHeight?: number;
    order_items?: string[];
    timesPurchased?: number;
    totalRevenue?: number;
    deliveryEstimate?: IDeliveryEstimate[];
    sales?: ISale[];
    profit?: IProfit[];
    createdAt: Date;
    updatedAt?: Date;
}

export interface ITag extends Document {
    name: string;
    products: Types.ObjectId[];
    createdAt: Date;
    updatedAt?: Date;
}

export interface IBrand extends Document {
    name: string;
    products?: string[];
    createdAt: Date;
    updatedAt?: Date;
}
export interface ICreateBrand extends Document {
    name: string;
    products?: string[];
}
export interface IUpdateBrand extends Document {
    name: string;
    products?: string[];
}

export interface IGuest extends Document {
    ip: string
    userAgent: Object
    location: ILocation
    referrer: string,
    user: Types.ObjectId
}
export interface ILocation extends Document {
    city: string
    country: string
    province: string
}
export interface IViewsProducts extends Document {
    product: Types.ObjectId
    views: number
    guests: IGuest[]
    createdAt: Date
    updatedAt?: Date
}