import { Request } from "express";
import { IRegionalRepository, ICarrierTerminal } from "../../index.js";

export class CreateCarrierTerminalService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<ICarrierTerminal | null> {
        const { name, carrierName, city, baseTax, pricePerKg, estimatedDelivery, availability } = req.body;

        const existCity = await this.regionalRepository.getCity({ _id: city });
        if (!existCity) {
            throw new Error("City not found");
        }

        const existTerminalName = await this.regionalRepository.getCarrierTerminal({ name });
        if (existTerminalName) {
            throw new Error("Terminal name already exists");
        }

        return await this.regionalRepository.createCarrierTerminal({
            name,
            carrierName,
            city,
            baseTax,
            pricePerKg,
            estimatedDelivery,
            availability
        });
    }
}
