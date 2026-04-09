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

export const createRegionValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().valid('SUL', 'CENTRO', 'NORTE').required(),
        availability: Joi.boolean().optional(),
    });
    validate(schema, req, res, next);
};

export const createProvinceValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        region: Joi.string().hex().length(24).required(),
        availability: Joi.boolean().optional(),
    });
    validate(schema, req, res, next);
};

export const createCityValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        province: Joi.string().hex().length(24).required(),
        availability: Joi.boolean().optional(),
    });
    validate(schema, req, res, next);
};

export const createNeighborhoodValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        city: Joi.string().hex().length(24).required(),
        zone: Joi.string().hex().length(24).required(),
        hasToll: Joi.boolean().optional(),
        tolls: Joi.array().items(Joi.string().hex().length(24)).optional(),
        availability: Joi.boolean().optional(),
    });
    validate(schema, req, res, next);
};

export const createShippingZoneValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        baseTax: Joi.number().min(0).required(),
        pricePerKg: Joi.number().min(0).optional(),
        estimatedDelivery: Joi.string().required(),
        description: Joi.string().allow("").optional(),
        availability: Joi.boolean().optional(),
    });
    validate(schema, req, res, next);
};

export const createTollValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        prices: Joi.object({
            motorcycle: Joi.number().min(0).required(),
            lightVehicle: Joi.number().min(0).required(),
            heavyVehicle: Joi.number().min(0).required(),
        }).required(),
        availability: Joi.boolean().optional(),
    });
    validate(schema, req, res, next);
};

export const createCarrierTerminalValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        carrierName: Joi.string().required(),
        city: Joi.string().hex().length(24).required(),
        baseTax: Joi.number().min(0).optional(),
        pricePerKg: Joi.number().min(0).required(),
        estimatedDelivery: Joi.string().required(),
        availability: Joi.boolean().optional(),
    });
    validate(schema, req, res, next);
};
