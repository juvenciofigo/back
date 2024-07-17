const BaseJoi = require("joi");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);

const ordersByCustumer = (req, res, next) => {
    console.log(false);
    const { error } = Joi.object({
        user: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};
module.exports = { ordersByCustumer };
