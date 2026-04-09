import { Request } from "express-jwt";
import { IProvince } from "../../interface/regional-model-interface.js";
import { IRegionalRepository } from "../../repositories/regional-repository-interface.js";

export class CreateProvinceService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<IProvince | null> {
        const { name, regionId } = req.body;

        const existProvinceName = await this.regionalRepository.getProvince({ name, region: regionId });

        if (existProvinceName) {
            throw new Error("Province name already exists in this region");
        }

        return await this.regionalRepository.createProvince({ name, region: regionId });
    }
}