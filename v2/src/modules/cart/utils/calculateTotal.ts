import { IVariation } from "src/modules/product/index.js";
import { ICartItem, ICartItemDetails, IItemVariation } from "../model/cart-interface-model.js";

/**
 * Calcula o preço de um único item do carrinho, considerando variações e estimativas.
 * @param productDetails Objeto do produto populado
 * @param variation Objeto da variação populado
 * @param deliveryEstimateId ID da estimativa selecionada
 */
export function calculateItemPrice(productDetails: any, variation: any, deliveryEstimateId: any) {
    if (!productDetails) return 0;

    const deliveryEstimate = productDetails.deliveryEstimate?.id
        ? productDetails.deliveryEstimate.id(deliveryEstimateId)
        : productDetails.deliveryEstimate?.find?.((d: any) => (d._id?.toString() || d.id?.toString()) === deliveryEstimateId?.toString());

    let extraPrice = 0;
    if (deliveryEstimate?.additionalCost) extraPrice += deliveryEstimate.additionalCost;
    if (variation?.color?.variationPrice) extraPrice += variation.color.variationPrice;
    if (variation?.model?.variationPrice) extraPrice += variation.model.variationPrice;
    if (variation?.size?.variationPrice) extraPrice += variation.size.variationPrice;
    if (variation?.material?.variationPrice) extraPrice += variation.material.variationPrice;

    return (productDetails.productPrice || 0) + extraPrice;
}

/**
 * Calcula o total de uma lista de itens.
 * Aceita tanto a lista bruta (ICartItem) quanto a detalhada (ICartItemDetails).
 */
export default function calculateTotal(items: (ICartItem | ICartItemDetails)[]) {
    let total = 0;

    for (const item of items) {
        // Se já tiver subtotal (ICartItemDetails), usa-o
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