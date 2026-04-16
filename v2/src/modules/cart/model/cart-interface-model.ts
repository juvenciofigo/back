import { Types, Document } from "mongoose";

export interface IItemVariation {
    color?: Types.ObjectId | string;
    model?: Types.ObjectId | string;
    size?: Types.ObjectId | string;
    material?: Types.ObjectId | string;
}

// Representa o item como é guardado no MongoDB
export interface ICartItem {
    item: Types.ObjectId; // ID único interno do item na array (para delete/update)
    productId: Types.ObjectId;
    quantity: number;
    deliveryEstimate?: Types.ObjectId;
    variation: IItemVariation;
}

// Representa o item após ser processado para a API (com populações e cálculos) e também o snapshot do pedido
export interface IItemDetails {
    item: Types.ObjectId;
    productId: Types.ObjectId | string;
    productName: string;
    picture?: string;
    itemPrice: number;
    quantity: number;
    totalWeight?: number;
    subtotal: number;
    variation?: IItemVariation;
    deliveryEstimate?: IDeliveryEstimate;
    itemAvailability?: boolean;
}

export interface IDeliveryEstimate {
    additionalCost: number;
    estimatedTime: string;
}

export interface ICart extends Document {
    cartItens: ICartItem[];
    cartUser: Types.ObjectId;
}
