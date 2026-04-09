import { IOrderCartItem } from "../../order/model/order-interface.js";
import { calculateItemPrice } from "./calculateTotal.js";

/**
 * Transforma um item do carrinho (populado) num snapshot para o pedido ou detalhe do carrinho.
 * @param item Item do carrinho populado (populado pelo CartRepository)
 */
export function formatCartItemSnapshot(item: any): IOrderCartItem {
    const product = item.productId;
    const variation = item.variation || {};

    // 1. Calcular o preço do item usando o utilitário partilhado
    const itemPrice = calculateItemPrice(product, variation, item.deliveryEstimate);

    // 2. Extrair a estimativa de entrega (Snapshot)
    const deliveryEstimate = product.deliveryEstimate?.id
        ? product.deliveryEstimate.id(item.deliveryEstimate)
        : product.deliveryEstimate?.find?.((d: any) => (d._id?.toString() || d.id?.toString()) === item.deliveryEstimate?.toString());

    // 3. Montar o objeto formatado (Snapshot)
    return {
        item: item.item || item._id, // Garantir fallback para ID do item no carrinho
        productId: product._id,
        product: product.productName,
        variation: {
            color: variation.color?.variationValue || null,
            model: variation.model?.variationValue || null,
            size: variation.size?.variationValue || null,
            material: variation.material?.variationValue || null
        },
        picture: product.productImage?.[0] || "",
        itemPrice: Number(itemPrice),
        deliveryEstimate: deliveryEstimate || null,
        quantity: Number(item.quantity) || 1,
        subtotal: Number(itemPrice * (item.quantity || 1)),
        itemAvailability: product.productAvailability ?? true
    } as IOrderCartItem;
}
