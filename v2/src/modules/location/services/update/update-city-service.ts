import { Request } from "express";
import { IRegionalRepository, ICity } from "../../index.js";

export class UpdateCityService {
    constructor(
        private regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<ICity | null> {
        const { id } = req.params;
        const { name, province, availability } = req.body;

        const city = await this.regionalRepository.updateCity(id!, {
            name,
            province,
            availability
        });

        return city;
    }
}
