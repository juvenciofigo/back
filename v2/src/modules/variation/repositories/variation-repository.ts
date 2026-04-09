import { ResponsePaginate, IVariation, IVariationRepository, VariationModel } from "../index.js";

class VariationRepository implements IVariationRepository {
    async createVariation(data: Partial<IVariation>) {
        return await VariationModel.create(data);
    }

    async fetchVariations(query: any, options: any): Promise<ResponsePaginate<IVariation>> {
        return await VariationModel.paginate(query, options);
    }

    async getVariation(query: any): Promise<IVariation | null> {
        return await VariationModel.findOne(query);
    }

    async updateVariation(id: string, data: Partial<IVariation>): Promise<IVariation | null> {
        return await VariationModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteVariation(id: string) {
        return await VariationModel.findByIdAndDelete(id);
    }
}

export default new VariationRepository();