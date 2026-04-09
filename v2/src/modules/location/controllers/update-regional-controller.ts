import { NextFunction, Response, Request } from "express";
import * as factories from "../factories/make-location-services.js";

export const updateRegionController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeUpdateRegionService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateProvinceController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeUpdateProvinceService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateCityController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeUpdateCityService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateNeighborhoodController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeUpdateNeighborhoodService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateShippingZoneController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeUpdateShippingZoneService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateTollController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeUpdateTollService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateCarrierTerminalController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeUpdateCarrierTerminalService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
