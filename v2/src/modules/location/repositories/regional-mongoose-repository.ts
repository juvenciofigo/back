import { ResponsePaginate } from "src/shared/interface.js";
import {
    IRegion, IProvince, ICity, INeighborhood, IShippingZone, IRegionalRepository, IToll, ICarrierTerminal,
    RegionModel,
    ProvinceModel,
    CityModel,
    TollModel,
    CarrierTerminalModel,
    NeighborhoodModel,
    ShippingZoneModel,

} from "../index.js";

export class RegionalRepository implements IRegionalRepository {

    // create
    async createRegion(region: Partial<IRegion>): Promise<IRegion | null> {
        return await RegionModel.create(region);

    }
    async createProvince(province: Partial<IProvince>): Promise<IProvince | null> {
        return await ProvinceModel.create(province);
    }
    async createCity(city: Partial<ICity>): Promise<ICity | null> {
        return await CityModel.create(city);
    }
    async createToll(toll: Partial<IToll>): Promise<IToll | null> {
        return await TollModel.create(toll);
    }
    async createCarrierTerminal(terminal: Partial<ICarrierTerminal>): Promise<ICarrierTerminal | null> {
        return await CarrierTerminalModel.create(terminal);
    }
    async createNeighborhood(neighborhood: Partial<INeighborhood>): Promise<INeighborhood | null> {
        return await NeighborhoodModel.create(neighborhood);
    }
    async createShippingZone(shippingZone: Partial<IShippingZone>): Promise<IShippingZone | null> {
        return await ShippingZoneModel.create(shippingZone);
    }


    // fetch
    async fetchRegions(query: any, options: any): Promise<ResponsePaginate<IRegion>> {
        return await (RegionModel as any).paginate(query, options);
    }
    async fetchProvinces(query: any, options: any): Promise<ResponsePaginate<IProvince>> {
        return await (ProvinceModel as any).paginate(query, options);
    }
    async fetchCities(query: any, options: any): Promise<ResponsePaginate<ICity>> {
        return await (CityModel as any).paginate(query, options);
    }
    async fetchTolls(query: any, options: any): Promise<ResponsePaginate<IToll>> {
        return await (TollModel as any).paginate(query, options);
    }
    async fetchCarrierTerminals(query: any, options: any): Promise<ResponsePaginate<ICarrierTerminal>> {
        return await (CarrierTerminalModel as any).paginate(query, options);
    }
    async fetchNeighborhoods(query: any, options: any): Promise<ResponsePaginate<INeighborhood>> {
        return await (NeighborhoodModel as any).paginate(query, options);
    }
    async fetchShippingZones(query: any, options: any): Promise<ResponsePaginate<IShippingZone>> {
        return await (ShippingZoneModel as any).paginate(query, options);
    }


    // get
    async getRegion(query: any): Promise<IRegion | null> {
        return await RegionModel.findOne(query);
    }
    async getProvince(query: any): Promise<IProvince | null> {
        return await ProvinceModel.findOne(query);
    }
    async getCity(query: any): Promise<ICity | null> {
        return await CityModel.findOne(query);
    }
    async getToll(query: any): Promise<IToll | null> {
        return await TollModel.findOne(query);
    }
    async getCarrierTerminal(query: any): Promise<ICarrierTerminal | null> {
        return await CarrierTerminalModel.findOne(query);
    }
    async getNeighborhood(query: any): Promise<INeighborhood | null> {
        return await NeighborhoodModel.findOne(query);
    }
    async getShippingZone(query: any): Promise<IShippingZone | null> {
        return await ShippingZoneModel.findOne(query);
    }


    // update
    async updateRegion(id: string, region: Partial<IRegion>): Promise<IRegion | null> {
        return await RegionModel.findByIdAndUpdate(id, region, { new: true });
    }
    async updateProvince(id: string, province: Partial<IProvince>): Promise<IProvince | null> {
        return await ProvinceModel.findByIdAndUpdate(id, province, { new: true });
    }
    async updateCity(id: string, city: Partial<ICity>): Promise<ICity | null> {
        return await CityModel.findByIdAndUpdate(id, city, { new: true });
    }
    async updateToll(id: string, toll: Partial<IToll>): Promise<IToll | null> {
        return await TollModel.findByIdAndUpdate(id, toll, { new: true });
    }
    async updateCarrierTerminal(id: string, terminal: Partial<ICarrierTerminal>): Promise<ICarrierTerminal | null> {
        return await CarrierTerminalModel.findByIdAndUpdate(id, terminal, { new: true });
    }
    async updateNeighborhood(id: string, neighborhood: Partial<INeighborhood>): Promise<INeighborhood | null> {
        return await NeighborhoodModel.findByIdAndUpdate(id, neighborhood, { new: true });
    }
    async updateShippingZone(id: string, shippingZone: Partial<IShippingZone>): Promise<IShippingZone | null> {
        return await ShippingZoneModel.findByIdAndUpdate(id, shippingZone, { new: true });
    }


    // delete
    async deleteRegion(id: string): Promise<IRegion | null> {
        return await RegionModel.findByIdAndDelete(id);
    }
    async deleteProvince(id: string): Promise<IProvince | null> {
        return await ProvinceModel.findByIdAndDelete(id);
    }
    async deleteCity(id: string): Promise<ICity | null> {
        return await CityModel.findByIdAndDelete(id);
    }
    async deleteToll(id: string): Promise<IToll | null> {
        return await TollModel.findByIdAndDelete(id);
    }
    async deleteCarrierTerminal(id: string): Promise<ICarrierTerminal | null> {
        return await CarrierTerminalModel.findByIdAndDelete(id);
    }
    async deleteNeighborhood(id: string): Promise<INeighborhood | null> {
        return await NeighborhoodModel.findByIdAndDelete(id);
    }
    async deleteShippingZone(id: string): Promise<IShippingZone | null> {
        return await ShippingZoneModel.findByIdAndDelete(id);
    }

}