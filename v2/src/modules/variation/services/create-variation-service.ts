import { BaseError } from "src/shared/BaseError.js";
import { IVariation, IVariationRepository, IProductRepository } from "../index.js";

export interface CreateVariationDTO {
    productId: string;
    variationType: string;
    variationValue: string;
    sku: string;
    variationPrice: number;
    variationPromotion?: number;
    variationStock: boolean;
    heightCm: number;
    widthCm: number;
    depthCm: number;
    weight: number;
    shippingFree: boolean;
    variationImage?: string[];
}

class CreateVariationService {
    constructor(
        private variationRepository: IVariationRepository,
        private productRepository: IProductRepository
    ) { }

    async execute(data: CreateVariationDTO): Promise<IVariation> {
        // 1. Verificar se o produto existe
        const product = await this.productRepository.getProduct(data.productId);

        if (!product) {
            throw new BaseError("Product not found", 404);
        }

        // 2. Verificar se o SKU já existe (Garante unicidade antes de tentar criar)
        const existVariation = await this.variationRepository.getVariation({ sku: data.sku });
        if (existVariation) {
            throw new BaseError("Sku already exists", 409);
        }

        const variationData: Partial<IVariation> = {
            variationProduct: product.id,
            variationType: data.variationType,
            variationValue: data.variationValue,
            sku: data.sku,
            variationPrice: data.variationPrice,
            variationStock: data.variationStock,
            variationImage: data.variationImage || [],
            delivery: {
                dimensions: {
                    heightCm: data.heightCm,
                    widthCm: data.widthCm,
                    depthCm: data.depthCm,
                },
                weight: data.weight,
                shippingFree: data.shippingFree
            }
        };

        if (data.variationPromotion !== undefined) {
            variationData.variationPromotion = data.variationPromotion;
        }

        // 3. Criar a variação
        const variation: IVariation = await this.variationRepository.createVariation(variationData);

        // 4. Atualização atômica do produto (evita race conditions)
        await this.productRepository.updateProductVariation(data.productId, variation.id);

        return variation;
    }
}

export default CreateVariationService;