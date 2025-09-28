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
  estimatedTime: "Imediata" | "7 dias" | "30 dias";
}

// Schemas principais
export interface IProduct extends Document {
  productName: string;
  productDescription: string;
  productSpecifications: string;
  productAvailability?: boolean;
  productPrice: number;
  productStock?: boolean;
  productImage?: string[];
  productCategory?: Types.ObjectId[];
  productSubcategory?: Types.ObjectId[];
  productSub_category?: Types.ObjectId[];
  productRatings?: Types.ObjectId[];
  productVariations?: Types.ObjectId[];
  productPromotion?: number;
  sku: string;
  productVendor: string;
  productModel?: string;
  productBrand?: Types.ObjectId;
  productWeight?: number;
  productLength?: number;
  productWidth?: number;
  productHeight?: number;
  order_items?: Types.ObjectId[];
  timesPurchased?: number;
  totalRevenue?: number;
  deliveryEstimate?: IDeliveryEstimate[];
  sales?: ISale[];
  profit?: IProfit[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITag extends Document {
  name: string;
  products: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBrand extends Document {
  name: string;
  products?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
