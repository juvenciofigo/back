import { IRegion, IProvince, ICity, INeighborhood, IShippingZone, IToll, ICarrierTerminal } from "../index.js";
import { ResponsePaginate } from "src/shared/interface.js";

export interface IRegionalRepository {
    createRegion(region: Partial<IRegion>): Promise<IRegion | null>;
    createProvince(province: Partial<IProvince>): Promise<IProvince | null>;
    createCity(city: Partial<ICity>): Promise<ICity | null>;
    createToll(toll: Partial<IToll>): Promise<IToll | null>;
    createCarrierTerminal(terminal: Partial<ICarrierTerminal>): Promise<ICarrierTerminal | null>;
    createNeighborhood(neighborhood: Partial<INeighborhood>): Promise<INeighborhood | null>;
    createShippingZone(shippingZone: Partial<IShippingZone>): Promise<IShippingZone | null>;

    fetchRegions(query: any, options: any): Promise<ResponsePaginate<IRegion>>;
    fetchProvinces(query: any, options: any): Promise<ResponsePaginate<IProvince>>;
    fetchCities(query: any, options: any): Promise<ResponsePaginate<ICity>>;
    fetchTolls(query: any, options: any): Promise<ResponsePaginate<IToll>>;
    fetchCarrierTerminals(query: any, options: any): Promise<ResponsePaginate<ICarrierTerminal>>;
    fetchNeighborhoods(query: any, options: any): Promise<ResponsePaginate<INeighborhood>>;
    fetchShippingZones(query: any, options: any): Promise<ResponsePaginate<IShippingZone>>;

    getRegion(query: any): Promise<IRegion | null>;
    getProvince(query: any): Promise<IProvince | null>;
    getCity(query: any): Promise<ICity | null>;
    getToll(query: any): Promise<IToll | null>;
    getCarrierTerminal(query: any): Promise<ICarrierTerminal | null>;
    getNeighborhood(query: any): Promise<INeighborhood | null>;
    getShippingZone(query: any): Promise<IShippingZone | null>;

    updateRegion(id: string, region: Partial<IRegion>): Promise<IRegion | null>;
    updateProvince(id: string, province: Partial<IProvince>): Promise<IProvince | null>;
    updateCity(id: string, city: Partial<ICity>): Promise<ICity | null>;
    updateToll(id: string, toll: Partial<IToll>): Promise<IToll | null>;
    updateCarrierTerminal(id: string, terminal: Partial<ICarrierTerminal>): Promise<ICarrierTerminal | null>;
    updateNeighborhood(id: string, neighborhood: Partial<INeighborhood>): Promise<INeighborhood | null>;
    updateShippingZone(id: string, shippingZone: Partial<IShippingZone>): Promise<IShippingZone | null>;

    deleteRegion(id: string): Promise<IRegion | null>;
    deleteProvince(id: string): Promise<IProvince | null>;
    deleteCity(id: string): Promise<ICity | null>;
    deleteToll(id: string): Promise<IToll | null>;
    deleteCarrierTerminal(id: string): Promise<ICarrierTerminal | null>;
    deleteNeighborhood(id: string): Promise<INeighborhood | null>;
    deleteShippingZone(id: string): Promise<IShippingZone | null>;
}