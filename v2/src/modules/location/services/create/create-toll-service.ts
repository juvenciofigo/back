import { Request } from "express";
import { IRegionalRepository, IToll } from "../../index.js";

export class CreateTollService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<IToll | null> {
        const { name, prices, availability } = req.body;

        const existTollName = await this.regionalRepository.getToll({ name });

        if (existTollName) {
            throw new Error("Toll name already exists");
        }

        return await this.regionalRepository.createToll({
            name,
            prices,
            availability
        });
    }
}
