import { NextFunction, Response, Request } from "express";
import * as factories from "../factories/make-location-services.js";

export const createRegionController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeCreateRegionService().execute(req);
        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const createProvinceController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeCreateProvinceService().execute(req);
        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const createCityController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeCreateCityService().execute(req);
        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const createNeighborhoodController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeCreateNeighborhoodService().execute(req);
        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const createShippingZoneController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeCreateShippingZoneService().execute(req);
        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const createTollController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeCreateTollService().execute(req);
        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const createCarrierTerminalController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeCreateCarrierTerminalService().execute(req);
        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};
