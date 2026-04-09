import { RegionalRepository } from "../repositories/regional-mongoose-repository.js";
import { CreateRegionService } from "../services/create/create-region-service.js";
import { CreateProvinceService } from "../services/create/create-province-service.js";
import { CreateCityService } from "../services/create/create-city-service.js";
import { CreateTollService } from "../services/create/create-toll-service.js";
import { CreateCarrierTerminalService } from "../services/create/create-carrier-terminal-service.js";
import { CreateNeighborhoodService } from "../services/create/create-neighborhood-service.js";
import { CreateShippingZoneService } from "../services/create/create-shippingZone-service.js";

import { FetchRegionsService } from "../services/fetch/fetch-regions-service.js";
import { FetchProvincesService } from "../services/fetch/fetch-provinces-service.js";
import { FetchCitiesService } from "../services/fetch/fetch-cities-service.js";
import { FetchTollsService } from "../services/fetch/fetch-tolls-service.js";
import { FetchCarrierTerminalsService } from "../services/fetch/fetch-carrier-terminals-service.js";
import { FetchNeighborhoodsService } from "../services/fetch/fetch-neighborhoods-service.js";
import { FetchShippingZonesService } from "../services/fetch/fetch-shipping-zones-service.js";

import { UpdateRegionService } from "../services/update/update-region-service.js";
import { UpdateProvinceService } from "../services/update/update-province-service.js";
import { UpdateCityService } from "../services/update/update-city-service.js";
import { UpdateTollService } from "../services/update/update-toll-service.js";
import { UpdateCarrierTerminalService } from "../services/update/update-carrier-terminal-service.js";
import { UpdateNeighborhoodService } from "../services/update/update-neighborhood-service.js";
import { UpdateShippingZoneService } from "../services/update/update-shipping-zone-service.js";

import { DeleteRegionService } from "../services/delete/delete-region-service.js";
import { DeleteProvinceService } from "../services/delete/delete-province-service.js";
import { DeleteCityService } from "../services/delete/delete-city-service.js";
import { DeleteTollService } from "../services/delete/delete-toll-service.js";
import { DeleteCarrierTerminalService } from "../services/delete/delete-carrier-terminal-service.js";
import { DeleteNeighborhoodService } from "../services/delete/delete-neighborhood-service.js";
import { DeleteShippingZoneService } from "../services/delete/delete-shipping-zone-service.js";

const regionalRepository = new RegionalRepository();

// Create
export const makeCreateRegionService = () => new CreateRegionService(regionalRepository);
export const makeCreateProvinceService = () => new CreateProvinceService(regionalRepository);
export const makeCreateCityService = () => new CreateCityService(regionalRepository);
export const makeCreateTollService = () => new CreateTollService(regionalRepository);
export const makeCreateCarrierTerminalService = () => new CreateCarrierTerminalService(regionalRepository);
export const makeCreateNeighborhoodService = () => new CreateNeighborhoodService(regionalRepository);
export const makeCreateShippingZoneService = () => new CreateShippingZoneService(regionalRepository);

// Fetch
export const makeFetchRegionsService = () => new FetchRegionsService(regionalRepository);
export const makeFetchProvincesService = () => new FetchProvincesService(regionalRepository);
export const makeFetchCitiesService = () => new FetchCitiesService(regionalRepository);
export const makeFetchTollsService = () => new FetchTollsService(regionalRepository);
export const makeFetchCarrierTerminalsService = () => new FetchCarrierTerminalsService(regionalRepository);
export const makeFetchNeighborhoodsService = () => new FetchNeighborhoodsService(regionalRepository);
export const makeFetchShippingZonesService = () => new FetchShippingZonesService(regionalRepository);

// Update
export const makeUpdateRegionService = () => new UpdateRegionService(regionalRepository);
export const makeUpdateProvinceService = () => new UpdateProvinceService(regionalRepository);
export const makeUpdateCityService = () => new UpdateCityService(regionalRepository);
export const makeUpdateTollService = () => new UpdateTollService(regionalRepository);
export const makeUpdateCarrierTerminalService = () => new UpdateCarrierTerminalService(regionalRepository);
export const makeUpdateNeighborhoodService = () => new UpdateNeighborhoodService(regionalRepository);
export const makeUpdateShippingZoneService = () => new UpdateShippingZoneService(regionalRepository);

// Delete
export const makeDeleteRegionService = () => new DeleteRegionService(regionalRepository);
export const makeDeleteProvinceService = () => new DeleteProvinceService(regionalRepository);
export const makeDeleteCityService = () => new DeleteCityService(regionalRepository);
export const makeDeleteTollService = () => new DeleteTollService(regionalRepository);
export const makeDeleteCarrierTerminalService = () => new DeleteCarrierTerminalService(regionalRepository);
export const makeDeleteNeighborhoodService = () => new DeleteNeighborhoodService(regionalRepository);
export const makeDeleteShippingZoneService = () => new DeleteShippingZoneService(regionalRepository);
