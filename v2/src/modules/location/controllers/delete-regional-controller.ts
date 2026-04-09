import { NextFunction, Response, Request } from "express";
import * as factories from "../factories/make-location-services.js";

export const deleteRegionController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeDeleteRegionService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteProvinceController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeDeleteProvinceService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteCityController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeDeleteCityService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteNeighborhoodController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeDeleteNeighborhoodService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteShippingZoneController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeDeleteShippingZoneService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteTollController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeDeleteTollService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteCarrierTerminalController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeDeleteCarrierTerminalService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
