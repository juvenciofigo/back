const BaseJoi = require("joi");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);

const C2B = (req, res, next) => {
    const { error } = Joi.object({
        // client_number: Joi.string().required(),
        // value: Joi.number().required(),
        // third_party_reference: Joi.string().required(),
        // transaction_reference: Joi.string().required(),
        
        client_number: Joi.string().length(12).required(),
        orderId: Joi.string().alphanum().length(24).required(),
    }).validate(req.body);

    if (error) {
        next(error);
    }
    next();
};

module.exports = {
    C2B,
};
