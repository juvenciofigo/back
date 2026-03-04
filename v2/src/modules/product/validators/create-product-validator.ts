import BaseJoi from "joi";
import Extension from "@hapi/joi-date";
const Joi = BaseJoi.extend(Extension);
import { Request, Response, NextFunction } from "express";

export async function createProductValidator(req: Request, res: Response, next: NextFunction) {
    const data = { ...req.body };

    const schema = Joi.object({
        productName: Joi.string().required(),
        productDescription: Joi.string().required(),
        productSpecifications: Joi.string().required(),
        productAvailability: Joi.boolean().required(),
        productPrice: Joi.number().required(),
        productStock: Joi.boolean().required(),
        productImage: Joi.array().optional(),
        productCategory: Joi.array().items(Joi.string().length(24).alphanum().required()).required(),
        productSubcategory: Joi.array().items(Joi.string().length(24).alphanum().optional()).optional(),
        productSub_category: Joi.array().items(Joi.string().length(24).alphanum().optional()).optional(),
        productPromotion: Joi.number().optional(),
        productVendor: Joi.string().required(),
        productModel: Joi.string().optional(),
        productBrand: Joi.string().alphanum().length(24).optional(),
        productWeight: Joi.number().required(),
        productLength: Joi.number().optional(),
        productWidth: Joi.number().optional(),
        productHeight: Joi.number().optional(),
        sku: Joi.string().required(),
        deliveryEstimate: Joi.array()
            .items(
                Joi.object({
                    estimatedTime: Joi.string().valid("Imediata", "7 dias", "30 dias").required(),
                    additionalCost: Joi.number().required(),
                })
            )
            .optional(),
        // acquisitionCost: Joi.number.required(),
        // additionalCosts: Joi.number.required(),
    });

    const { error } = schema.validate(data);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}
