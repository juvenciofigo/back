import { Request } from "express";
import { IRegionalRepository, ICarrierTerminal } from "../../index.js";

export class UpdateCarrierTerminalService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<ICarrierTerminal | null> {
        const { id } = req.params;
        const { name, carrierName, city, baseTax, pricePerKg, estimatedDelivery, availability } = req.body;

        return await this.regionalRepository.updateCarrierTerminal(id!, {
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
