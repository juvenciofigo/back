import { IVariation, ResponsePaginate } from "../index.js";

export interface IVariationRepository {
    createVariation(data: Partial<IVariation>): Promise<IVariation>;
    fetchVariations(query: any, options: any): Promise<ResponsePaginate<IVariation>>;
    getVariation(query: any): Promise<IVariation | null>;
    updateVariation(id: string, data: Partial<IVariation>): Promise<IVariation | null>;
    deleteVariation(id: string): Promise<IVariation | null>;
}