import { NextFunction, Response, Request } from "express";
import * as factories from "../factories/make-location-services.js";

export const fetchRegionsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeFetchRegionsService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const fetchProvincesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeFetchProvincesService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const fetchCitiesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeFetchCitiesService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const fetchNeighborhoodsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeFetchNeighborhoodsService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const fetchShippingZonesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeFetchShippingZonesService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const fetchTollsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeFetchTollsService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const fetchCarrierTerminalsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await factories.makeFetchCarrierTerminalsService().execute(req as any);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
