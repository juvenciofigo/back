import BaseJoi from "joi";
import Extension from "@hapi/joi-date";
const Joi = BaseJoi.extend(Extension);
import { Request, Response, NextFunction } from "express";

export async function updateProductValidator(req: Request, res: Response, next: NextFunction) {
    // Validar o ID no param
    const paramSchema = Joi.object({
        id: Joi.string().length(24).alphanum().required(),
    });

    const paramResult = paramSchema.validate(req.params);
    if (paramResult.error) {
        return res.status(400).json({ message: paramResult.error.details[0].message });
    }

    // Validar o body — todos os campos são opcionais no update
    const bodySchema = Joi.object({
        productName: Joi.string().optional(),
        productDescription: Joi.string().optional(),
        productSpecifications: Joi.string().optional(),
        productAvailability: Joi.boolean().optional(),
        productPrice: Joi.number().min(0).optional(),
        productStock: Joi.boolean().optional(),
        productImage: Joi.array().optional(),
        productCategory: Joi.array().items(Joi.string().length(24).alphanum()).optional(),
        productSubcategory: Joi.array().items(Joi.string().length(24).alphanum()).optional(),
        productSub_category: Joi.array().items(Joi.string().length(24).alphanum()).optional(),
        productPromotion: Joi.number().min(0).optional().allow(null),
        productVendor: Joi.string().optional(),
        productModel: Joi.string().optional(),
        productBrand: Joi.string().alphanum().length(24).optional().allow(null),
        productWeight: Joi.number().min(0).optional(),
        productLength: Joi.number().min(0).optional(),
        productWidth: Joi.number().min(0).optional(),
        productHeight: Joi.number().min(0).optional(),
        sku: Joi.string().optional(),
        deliveryEstimate: Joi.array()
            .items(
                Joi.object({
                    estimatedTime: Joi.string().valid("IMMEDIATE", "7_DAYS", "30_DAYS").required(),
                    additionalCost: Joi.number().min(0).required(),
                })
            )
            .optional(),
    });

    const bodyResult = bodySchema.validate(req.body);
    if (bodyResult.error) {
        return res.status(400).json({ message: bodyResult.error.details[0].message });
    }

    next();
}
