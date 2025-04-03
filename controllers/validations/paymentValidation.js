const BaseJoi = require("joi");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);

const C2B = (req, res, next) => {
    const { error } = Joi.object({
        client_number: Joi.string().length(12).required(),
        orderId: Joi.string().alphanum().length(24).required(),
    }).validate(req.body);

    if (error) {
        console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = {
    C2B,
};
