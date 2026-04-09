import { Request } from "express";
import { INeighborhood, IRegionalRepository } from "../../index.js";

export class CreateNeighborhoodService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<INeighborhood | null> {
        const { name, city, zone, hasToll, tollType, availability } = req.body;

        const existCity = await this.regionalRepository.getCity({ _id: city });

        if (!existCity) {
            throw new Error("City not found");
        }

        const existZone = await this.regionalRepository.getShippingZone({ _id: zone });

        if (!existZone) {
            throw new Error("Zone not found");
        }

        const existNeighborhoodName = await this.regionalRepository.getNeighborhood({ name, city: city });

        if (existNeighborhoodName) {
            throw new Error("Neighborhood name already exists in this city");
        }

        return await this.regionalRepository.createNeighborhood({ 
            name, 
            city: city, 
            zone: zone, 
            hasToll, 
            tollType,
            availability
        });
    }
}