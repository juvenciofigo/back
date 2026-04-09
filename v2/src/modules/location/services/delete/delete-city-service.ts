import { Request } from "express";
import { IRegionalRepository, ICity } from "../../index.js";

export class DeleteCityService {
    constructor(
        private readonly regionalRepository: IRegionalRepository
    ) { }

    async execute(req: Request): Promise<ICity | null> {
        const { id } = req.params;

        return await this.regionalRepository.deleteCity(id!);
    }
}
