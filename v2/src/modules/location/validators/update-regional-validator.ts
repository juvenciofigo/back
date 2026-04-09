import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const validate = (schema: Joi.ObjectSchema, req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: "Erro de validação",
            details: error.details.map(d => d.message)
        });
    }
    next();
};

export const updateRegionValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().valid('SUL', 'CENTRO', 'NORTE').optional(),
        availability: Joi.boolean().optional(),
    });
    validate(schema, req, res, next);
};

export const updateProvinceValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().optional(),
        region: Joi.string().hex().length(24).optional(),
        availability: Joi.boolean().optional(),
    });
    validate(schema, req, res, next);
};

export const updateCityValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().optional(),
        province: Joi.string().hex().length(24).optional(),
        availability: Joi.boolean().optional(),
    });
    validate(schema, req, res, next);
};

export const updateNeighborhoodValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().optional(),
        city: Joi.string().hex().length(24).optional(),
        zone: Joi.string().hex().length(24).optional(),
        hasToll: Joi.boolean().optional(),
        tolls: Joi.array().items(Joi.string().hex().length(24)).optional(),
        availability: Joi.boolean().optional(),
    });
    validate(schema, req, res, next);
};

export const updateShippingZoneValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().optional(),
        baseTax: Joi.number().min(0).optional(),
        pricePerKg: Joi.number().min(0).optional(),
        estimatedDelivery: Joi.string().optional(),
        description: Joi.string().allow("").optional(),
        availability: Joi.boolean().optional(),
    });
    validate(schema, req, res, next);
};

export const updateTollValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().optional(),
        prices: Joi.object({
            motorcycle: Joi.number().min(0).optional(),
            lightVehicle: Joi.number().min(0).optional(),
            heavyVehicle: Joi.number().min(0).optional(),
        }).optional(),
        availability: Joi.boolean().optional(),
    });
    validate(schema, req, res, next);
};

export const updateCarrierTerminalValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().optional(),
        carrierName: Joi.string().optional(),
        city: Joi.string().hex().length(24).optional(),
        baseTax: Joi.number().min(0).optional(),
        pricePerKg: Joi.number().min(0).optional(),
        estimatedDelivery: Joi.string().optional(),
        availability: Joi.boolean().optional(),
    });
    validate(schema, req, res, next);
};
