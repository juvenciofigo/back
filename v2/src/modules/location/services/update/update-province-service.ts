import { Request } from "express-jwt";
import { IRegionalRepository, IProvince } from "../../index.js";

export class UpdateProvinceService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<IProvince | null> {
        const { id } = req.params;
        const data = req.body;

        return await this.regionalRepository.updateProvince(id!, data);
    }
}
