import { Request } from "express-jwt";
import { IRegion } from "../../interface/regional-model-interface.js";
import { IRegionalRepository } from "../../repositories/regional-repository-interface.js";

export class CreateRegionService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<IRegion | null> {
        const { name } = req.body;

        const existRegionName = await this.regionalRepository.getRegion({ name });

        if (existRegionName) {
            throw new Error("Region name already exists");
        }

        return await this.regionalRepository.createRegion({ name });
    }
}