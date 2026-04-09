import { Types, Document } from "mongoose";

export interface IItemVariation {
    color?: Types.ObjectId;
    model?: Types.ObjectId;
    size?: Types.ObjectId;
    material?: Types.ObjectId;
}

// Representa o item como é guardado no MongoDB
export interface ICartItem {
    item: Types.ObjectId; // ID único interno do item na array (para delete/update)
    productId: Types.ObjectId;
    quantity: number;
    deliveryEstimate?: Types.ObjectId;
    variation: IItemVariation;
}

// // Representa o item após ser processado para a API (com populações e cálculos)
export interface ICartItemDetails {
    item: Types.ObjectId;
    productId: string;
    productName: string;
    picture: string;
    variation: IItemVariation; // Aqui virá o objecto populado da variação
    deliveryEstimate?: any; // Aqui virá o objecto populado do estimate
    productPrice: number;
    quantity: number;
    subtotal: number;
}

export interface ICart extends Document {
    cartItens: ICartItem[];
    cartUser: Types.ObjectId;
}
