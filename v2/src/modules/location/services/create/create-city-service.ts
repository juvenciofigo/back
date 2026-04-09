import { Request } from "express";
import { IRegionalRepository, ICity } from "../../index.js";

export class CreateCityService {
    constructor(
        private regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<ICity | null> {
        const { name, province, availability } = req.body;

        const city = await this.regionalRepository.createCity({
            name,
            province,
            availability
        });

        return city;
    }
}