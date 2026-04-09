import { Request } from "express-jwt";
import { IShippingZone } from "../../interface/regional-model-interface.js";
import { IRegionalRepository } from "../../repositories/regional-repository-interface.js";

export class CreateShippingZoneService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<IShippingZone | null> {
        const { name, regionId, baseTax, pricePerKg, estimatedDelivery, description } = req.body;

        const existRegion = await this.regionalRepository.getRegion({ _id: regionId });

        if (!existRegion) {
            throw new Error("Region not found");
        }

        const existZoneName = await this.regionalRepository.getShippingZone({ name, region: regionId });

        if (existZoneName) {
            throw new Error("Zone name already exists in this region");
        }

        return await this.regionalRepository.createShippingZone({ name, baseTax, pricePerKg, estimatedDelivery, description });
    }
}