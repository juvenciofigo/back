import { Router } from "express";
import { IsAuthValidator } from "../../shared/validators/is-auth-validator.js";
import { IsAdminValidator } from "../../shared/validators/is-admin-validator.js";

import * as fetchController from "./controllers/fetch-regional-controller.js";
import * as createController from "./controllers/create-regional-controller.js";
import * as updateController from "./controllers/update-regional-controller.js";
import * as deleteController from "./controllers/delete-regional-controller.js";

import { fetchRegionalValidator } from "./validators/fetch-regional-validator.js";
import * as createValidator from "./validators/create-regional-validator.js";
import * as updateValidator from "./validators/update-regional-validator.js";

const routes = Router();

/**
 * @Routes_Regiões
 */
routes.get("/location/regions", fetchRegionalValidator, fetchController.fetchRegionsController);
routes.post("/location/regions", IsAuthValidator.require, IsAdminValidator, createValidator.createRegionValidator, createController.createRegionController);
routes.patch("/location/regions/:id", IsAuthValidator.require, IsAdminValidator, updateValidator.updateRegionValidator, updateController.updateRegionController);
routes.delete("/location/regions/:id", IsAuthValidator.require, IsAdminValidator, deleteController.deleteRegionController);

/**
 * @Routes_Províncias
 */
routes.get("/location/provinces", fetchRegionalValidator, fetchController.fetchProvincesController);
routes.post("/location/provinces", IsAuthValidator.require, IsAdminValidator, createValidator.createProvinceValidator, createController.createProvinceController);
routes.patch("/location/provinces/:id", IsAuthValidator.require, IsAdminValidator, updateValidator.updateProvinceValidator, updateController.updateProvinceController);
routes.delete("/location/provinces/:id", IsAuthValidator.require, IsAdminValidator, deleteController.deleteProvinceController);

/**
 * @Routes_Cidades
 */
routes.get("/location/cities", fetchRegionalValidator, fetchController.fetchCitiesController);
routes.post("/location/cities", IsAuthValidator.require, IsAdminValidator, createValidator.createCityValidator, createController.createCityController);
routes.patch("/location/cities/:id", IsAuthValidator.require, IsAdminValidator, updateValidator.updateCityValidator, updateController.updateCityController);
routes.delete("/location/cities/:id", IsAuthValidator.require, IsAdminValidator, deleteController.deleteCityController);

/**
 * @Routes_Bairros (Neighborhoods)
 */
routes.get("/location/neighborhoods", fetchRegionalValidator, fetchController.fetchNeighborhoodsController);
routes.post("/location/neighborhoods", IsAuthValidator.require, IsAdminValidator, createValidator.createNeighborhoodValidator, createController.createNeighborhoodController);
routes.patch("/location/neighborhoods/:id", IsAuthValidator.require, IsAdminValidator, updateValidator.updateNeighborhoodValidator, updateController.updateNeighborhoodController);
routes.delete("/location/neighborhoods/:id", IsAuthValidator.require, IsAdminValidator, deleteController.deleteNeighborhoodController);

/**
 * @Routes_Zonas_de_Entrega (ShippingZones)
 */
routes.get("/location/shipping-zones", fetchRegionalValidator, fetchController.fetchShippingZonesController);
routes.post("/location/shipping-zones", IsAuthValidator.require, IsAdminValidator, createValidator.createShippingZoneValidator, createController.createShippingZoneController);
routes.patch("/location/shipping-zones/:id", IsAuthValidator.require, IsAdminValidator, updateValidator.updateShippingZoneValidator, updateController.updateShippingZoneController);
routes.delete("/location/shipping-zones/:id", IsAuthValidator.require, IsAdminValidator, deleteController.deleteShippingZoneController);

/**
 * @Routes_Portagens (Tolls)
 */
routes.get("/location/tolls", fetchRegionalValidator, fetchController.fetchTollsController);
routes.post("/location/tolls", IsAuthValidator.require, IsAdminValidator, createValidator.createTollValidator, createController.createTollController);
routes.patch("/location/tolls/:id", IsAuthValidator.require, IsAdminValidator, updateValidator.updateTollValidator, updateController.updateTollController);
routes.delete("/location/tolls/:id", IsAuthValidator.require, IsAdminValidator, deleteController.deleteTollController);

/**
 * @Routes_Terminais_Transportadoras (Carrier Terminals)
 */
routes.get("/location/carrier-terminals", fetchRegionalValidator, fetchController.fetchCarrierTerminalsController);
routes.post("/location/carrier-terminals", IsAuthValidator.require, IsAdminValidator, createValidator.createCarrierTerminalValidator, createController.createCarrierTerminalController);
routes.patch("/location/carrier-terminals/:id", IsAuthValidator.require, IsAdminValidator, updateValidator.updateCarrierTerminalValidator, updateController.updateCarrierTerminalController);
routes.delete("/location/carrier-terminals/:id", IsAuthValidator.require, IsAdminValidator, deleteController.deleteCarrierTerminalController);

export default routes;
