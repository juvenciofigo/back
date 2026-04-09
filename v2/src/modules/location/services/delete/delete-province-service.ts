import { Request } from "express-jwt";
import { IRegionalRepository, IProvince } from "../../index.js";

export class DeleteProvinceService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<IProvince | null> {
        const { id } = req.params;

        return await this.regionalRepository.deleteProvince(id!);
    }
}
