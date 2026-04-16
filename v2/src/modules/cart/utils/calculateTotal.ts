import { Types } from "mongoose";
import { IDeliveryEstimate, IProduct, IVariation } from "src/modules/product/index.js";
import { ICartItem, IItemDetails, IItemVariation } from "../model/cart-interface-model.js";

/**
 * Calcula o preço de um único item do carrinho, considerando variações e estimativas.
 * @param productDetails Objeto do produto populado
 * @param variation Objeto da variação populado (populado)
 * @param deliveryEstimateId ID da estimativa selecionada
 */
export function calculateItemPrice( productDetails: IProduct,  variation: any, deliveryEstimateId?: string | Types.ObjectId) {
    if (!productDetails) return 0;

    // 1. Encontrar a estimativa correta dentro do produto usando o ID
    // Fazemos o cast para 'any' para evitar erro de tipo caso seja um DocumentArray do Mongoose
    const deliveryEstimates = productDetails.deliveryEstimate as any;
    const selectedEstimate = deliveryEstimates?.id
        ? deliveryEstimates.id(deliveryEstimateId)
        : deliveryEstimates?.find?.((d: any) =>
            (d._id?.toString() || d.id?.toString()) === deliveryEstimateId?.toString()
        );

    let extraPrice = 0;

    // 2. Somar custo adicional da entrega, se existir
    if (selectedEstimate?.additionalCost) {
        extraPrice += selectedEstimate.additionalCost;
    }

    // 3. Somar custos das variações (considerando que vêm populadas)
    if (variation?.color?.variationPrice) extraPrice += variation.color.variationPrice;
    if (variation?.model?.variationPrice) extraPrice += variation.model.variationPrice;
    if (variation?.size?.variationPrice) extraPrice += variation.size.variationPrice;
    if (variation?.material?.variationPrice) extraPrice += variation.material.variationPrice;

    return (productDetails.productPrice || 0) + extraPrice;
}

/**
 * Calcula o total de uma lista de itens.
 * Aceita tanto a lista bruta (ICartItem) quanto a detalhada (IItemDetails).
 */
export default function calculateTotal(items: (ICartItem | IItemDetails)[]) {
    let total = 0;

    for (const item of items) {
        // Se já tiver subtotal (IItemDetails), usa-o
        if ("subtotal" in item) {
            total += item.subtotal;
            continue;
        }

        // Caso contrário, calcula manualmente (ICartItem)
        const productDetails = (item as any).productId;
        if (!productDetails || typeof productDetails === "string") continue;

        const price = calculateItemPrice(productDetails, item.variation, item.deliveryEstimate);
        total += price * (item.quantity || 1);
    }

    return total;
}