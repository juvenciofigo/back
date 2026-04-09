import { Request } from "express";
import { IRegionalRepository, IToll } from "../../index.js";

export class UpdateTollService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<IToll | null> {
        const { id } = req.params;
        const { name, prices, availability } = req.body;

        return await this.regionalRepository.updateToll(id!, {
            name,
            prices,
            availability
        });
    }
}
